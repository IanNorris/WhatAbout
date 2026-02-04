/* eslint-disable no-unused-vars */
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
    const lastKnotRef = useRef(''); // Track last known knot
    const lastChoicePointStateRef = useRef(null); // State saved at last choice point (safe to restore)
    const pagesRef = useRef([]); // Keep track of pages for saving with navigation

    useEffect(() => {
        if (storyContent) {
            console.log('useInkStory initializing:', { currentStoryId, savedState: savedState ? 'present' : 'null' });
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
                
                // Bind external functions BEFORE restoring state
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
                        console.log('navigateTo called from Ink:', { storyId, currentStoryTitle });
                        // Fire off async work but return immediately
                        (async () => {
                            try {
                                // Save both the Ink state and the pages for full restoration
                                const saveData = {
                                    inkState: lastChoicePointStateRef.current,
                                    pages: pagesRef.current
                                };
                                
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
                                
                                // Navigate with parent info, passing saved state and pages
                                onNavigateToStory(saveData, {
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
                
                // Restore saved state if provided (AFTER binding external functions)
                // savedState can be either a string (old format) or { inkState, pages } object (new format)
                let restoredFromState = false;
                if (savedState) {
                    try {
                        console.log('Restoring story state for:', currentStoryId);
                        
                        // Handle both old string format and new object format
                        const inkState = typeof savedState === 'string' ? savedState : savedState.inkState;
                        const savedPages = typeof savedState === 'object' && savedState.pages ? savedState.pages : null;
                        
                        if (inkState) {
                            s.state.LoadJson(inkState);
                            restoredFromState = true;
                            
                            // Restore pages if we have them
                            if (savedPages && savedPages.length > 0) {
                                console.log('Restoring', savedPages.length, 'pages of history');
                                setPages(savedPages);
                                pagesRef.current = savedPages;
                            }
                            
                            // After restoring, check if we're at a choice point
                            if (s.currentChoices && s.currentChoices.length > 0) {
                                console.log('Restored to choice point with', s.currentChoices.length, 'choices');
                                setCurrentChoices(s.currentChoices);
                                pendingChoicesRef.current = s.currentChoices.map(c => c.text);
                                
                                // If we don't have saved pages, create a placeholder
                                if (!savedPages || savedPages.length === 0) {
                                    setPages([{
                                        paragraphs: [{ text: '(Continuing from where you left off...)', tags: [] }],
                                        choices: null, // Don't set choices here - currentChoices handles it
                                        selectedChoiceIndex: null,
                                        selectedChoiceText: null,
                                        savedState: inkState
                                    }]);
                                }
                            } else if (s.canContinue) {
                                // Need to continue to get more content
                                continueStory();
                            }
                        }
                    } catch (err) {
                        console.error("Failed to restore story state:", err);
                        restoredFromState = false;
                        // Continue without restored state - story will start from beginning
                    }
                }
                
                // Only continue from scratch if we didn't restore
                if (!restoredFromState) {
                    continueStory();
                }
            } catch (err) {
                console.error("Failed to load Ink story", err);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storyContent, currentStoryId, savedState]); // Re-run when story content, ID, or saved state changes

    // Keep pagesRef in sync with pages state for navigation saving
    useEffect(() => {
        pagesRef.current = pages;
    }, [pages]);

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
                selectedChoiceText: null,
                savedState: null // Will store state before choice is made
            };
            setPages(prev => {
                const updated = [...prev, newPage];
                pagesRef.current = updated; // Keep ref in sync synchronously
                return updated;
            });
        }

        if (s.currentChoices && s.currentChoices.length > 0) {
            const choiceTexts = s.currentChoices.map(c => c.text);
            setCurrentChoices(s.currentChoices);
            pendingChoicesRef.current = choiceTexts;
            
            // Save state at this choice point for potential replay AND for cross-story navigation
            const stateToSave = s.state.ToJson();
            lastChoicePointStateRef.current = stateToSave; // Keep track for navigation
            setPages(prev => {
                const updated = [...prev];
                if (updated.length > 0) {
                    updated[updated.length - 1] = {
                        ...updated[updated.length - 1],
                        savedState: stateToSave
                    };
                }
                pagesRef.current = updated; // Keep ref in sync synchronously
                return updated;
            });
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
                pagesRef.current = updated; // Keep ref in sync synchronously
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

    // Replay from a previous page with a different choice
    const replayFromPage = useCallback((pageIndex, choiceIndex) => {
        const s = storyRef.current;
        if (!s) return;

        // Get the saved state from that page
        const targetPage = pages[pageIndex];
        if (!targetPage || !targetPage.savedState) {
            console.error('Cannot replay: no saved state for page', pageIndex);
            return;
        }

        try {
            // Restore story state to before the choice was made
            s.state.LoadJson(targetPage.savedState);
            
            // Truncate pages to remove everything after this page
            setPages(prev => prev.slice(0, pageIndex + 1));
            
            // Reset ended state
            setIsEnded(false);
            
            // Now make the new choice
            const choiceTexts = targetPage.choices;
            const selectedText = choiceTexts[choiceIndex];
            
            // Update the page with new selection
            setPages(prev => {
                const updated = [...prev];
                if (updated.length > 0) {
                    updated[updated.length - 1] = {
                        ...updated[updated.length - 1],
                        selectedChoiceIndex: choiceIndex,
                        selectedChoiceText: selectedText
                    };
                }
                return updated;
            });

            s.ChooseChoiceIndex(choiceIndex);
            setCurrentChoices([]);
            pendingChoicesRef.current = null;
            continueStory();
        } catch (err) {
            console.error('Failed to replay from page:', err);
        }
    }, [pages, continueStory]);

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
        replayFromPage,
        isEnded,
        resetStory,
        currentKnot,
        availableKnots,
        navigateToKnot
    };
};

export default useInkStory;
