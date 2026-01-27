import { useState, useEffect, useRef, useCallback } from 'react';
import { Story } from 'inkjs';

const useInkStory = (storyContent, currentStoryId, currentStoryTitle, savedState, onExit, onNavigateToStory) => {
    const [pages, setPages] = useState([]); // Array of page objects with paragraphs, choices, and selection info
    const [currentChoices, setCurrentChoices] = useState([]);
    const [isEnded, setIsEnded] = useState(false);
    const [globalTags, setGlobalTags] = useState({});
    const [currentKnot, setCurrentKnot] = useState('');
    const [availableKnots, setAvailableKnots] = useState([]);

    const storyRef = useRef(null);
    const pendingChoicesRef = useRef(null); // Store choices for the current page before selection
    const savedStateRef = useRef(savedState); // Use ref to avoid re-triggering effect
    const lastKnotRef = useRef(''); // Track last known knot

    useEffect(() => {
        if (storyContent) {
            // Reset state to avoid duplication (React Strict Mode compatibility)
            setPages([]);
            setCurrentChoices([]);
            setIsEnded(false);

            try {
                const s = new Story(storyContent);
                storyRef.current = s;
                
                // Extract available knots from story JSON
                // Knots are stored in root[2] (after the main flow and "done" marker)
                if (Array.isArray(storyContent.root) && storyContent.root.length > 2) {
                    const knotsObject = storyContent.root[2];
                    if (typeof knotsObject === 'object') {
                        const knots = Object.keys(knotsObject).filter(key => 
                            !key.startsWith('global decl') && key !== 'listDefs'
                        );
                        setAvailableKnots(knots);
                    }
                }
                
                // Restore saved state if provided
                if (savedStateRef.current) {
                    try {
                        s.state.LoadJson(savedStateRef.current);
                    } catch (err) {
                        console.error("Failed to restore story state:", err);
                    }
                }
                
                // Bind external function for exiting to hub
                if (onExit) {
                    s.BindExternalFunction('exit', () => {
                        // Delay to allow reading final text (3 seconds)
                        setTimeout(() => {
                            onExit();
                        }, 3000);
                    });
                }
                
                // Bind external function for navigating to another story
                if (onNavigateToStory) {
                    s.BindExternalFunction('navigateTo', (storyId) => {
                        // Fire off async work but return immediately
                        (async () => {
                            try {
                                // Save current story state
                                const currentState = s.state.ToJson();
                                
                                // Import loadInkStory and loadStoryList dynamically
                                const { loadInkStory, loadStoryList } = await import('../stories');
                                
                                // Get story metadata
                                const storyList = await loadStoryList();
                                const targetStory = storyList.find(story => story.id === storyId);
                                
                                if (!targetStory) {
                                    console.error(`Story not found: ${storyId}`);
                                    return;
                                }
                                
                                // Load and compile the story
                                const compiledStory = await loadInkStory(targetStory.inkPath);
                                
                                // Navigate with parent info, passing current state
                                onNavigateToStory(currentState, {
                                    ...targetStory,
                                    content: compiledStory,
                                    parentStoryTitle: currentStoryTitle // Track where we came from (use title, not ID)
                                });
                            } catch (error) {
                                console.error('Error navigating to story:', error);
                            }
                        })();
                        
                        // Return nothing (void) - Ink will treat this as null
                        return null;
                    });
                }
                
                continueStory();
            } catch (err) {
                console.error("Failed to load Ink story", err);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storyContent, currentStoryId]); // Only re-run when story content or ID changes

    const continueStory = useCallback(() => {
        const s = storyRef.current;
        if (!s) return;

        const newParagraphs = [];
        while (s.canContinue) {
            const text = s.Continue();
            const tags = s.currentTags; // Array of strings

            // Parse tags if needed
            // Simple tag handling: just store them with the paragraph
            newParagraphs.push({ text, tags });
        }

        // Add new paragraphs as a new page with choice metadata
        if (newParagraphs.length > 0) {
            const newPage = {
                paragraphs: newParagraphs,
                choices: null,
                selectedChoiceIndex: null,
                selectedChoiceText: null
            };
            setPages(prev => [...prev, newPage]);
        }

        if (s.currentChoices && s.currentChoices.length > 0) {
            const choiceTexts = s.currentChoices.map(c => c.text);
            setCurrentChoices(s.currentChoices);
            pendingChoicesRef.current = choiceTexts;
        } else {
            setCurrentChoices([]);
            pendingChoicesRef.current = null;
            setIsEnded(true); // Or maybe just no choices?
        }
    }, []);

    const makeChoice = useCallback((index) => {
        const s = storyRef.current;
        if (!s) return;

        // Store the choice information on the last page before continuing
        const choiceTexts = pendingChoicesRef.current;
        const selectedText = currentChoices[index]?.text;
        
        if (choiceTexts && selectedText) {
            setPages(prev => {
                const updated = [...prev];
                if (updated.length > 0) {
                    const lastPage = updated[updated.length - 1];
                    updated[updated.length - 1] = {
                        ...lastPage,
                        choices: choiceTexts,
                        selectedChoiceIndex: index,
                        selectedChoiceText: selectedText
                    };
                }
                return updated;
            });
        }

        s.ChooseChoiceIndex(index);
        
        // Try to detect knot from the choice's target path
        try {
            const choice = currentChoices[index];
            if (choice && choice.targetPath) {
                const pathComponents = choice.targetPath.componentsString || choice.targetPath.toString();
                const knotName = pathComponents.split('.')[0];
                if (knotName && !knotName.match(/^\d+$/)) {
                    lastKnotRef.current = knotName;
                    setCurrentKnot(knotName);
                }
            }
        } catch (err) {
            // Silently fail - not critical
        }
        
        setCurrentChoices([]);
        pendingChoicesRef.current = null;
        continueStory();
    }, [continueStory, currentChoices]);

    const resetStory = useCallback(() => {
        if (storyRef.current) {
            storyRef.current.ResetState();
            setPages([]);
            setCurrentChoices([]);
            setIsEnded(false);
            lastKnotRef.current = '';
            setCurrentKnot('');
            continueStory();
        }
    }, [continueStory]);

    const navigateToKnot = useCallback((knotPath) => {
        const s = storyRef.current;
        if (!s) return;

        try {
            // Clear current pages and reset to navigate to knot
            setPages([]);
            setCurrentChoices([]);
            setIsEnded(false);
            
            // Update the knot tracker immediately
            lastKnotRef.current = knotPath;
            setCurrentKnot(knotPath);
            
            // Use ChoosePathString to jump to the knot
            s.ChoosePathString(knotPath);
            continueStory();
        } catch (err) {
            console.error(`Failed to navigate to knot: ${knotPath}`, err);
        }
    }, [continueStory]);

    return {
        pages,
        currentChoices,
        makeChoice,
        isEnded,
        resetStory,
        currentKnot,
        availableKnots,
        navigateToKnot
    };
};

export default useInkStory;
