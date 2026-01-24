import { useState, useEffect, useRef, useCallback } from 'react';
import { Story } from 'inkjs';

const useInkStory = (storyContent) => {
    const [pages, setPages] = useState([]); // Array of page objects with paragraphs, choices, and selection info
    const [currentChoices, setCurrentChoices] = useState([]);
    const [isEnded, setIsEnded] = useState(false);
    const [globalTags, setGlobalTags] = useState({});

    const storyRef = useRef(null);
    const pendingChoicesRef = useRef(null); // Store choices for the current page before selection

    useEffect(() => {
        if (storyContent) {
            // Reset state to avoid duplication (React Strict Mode compatibility)
            setPages([]);
            setCurrentChoices([]);
            setIsEnded(false);

            try {
                const s = new Story(storyContent);
                storyRef.current = s;
                continueStory();
            } catch (err) {
                console.error("Failed to load Ink story", err);
            }
        }
    }, [storyContent]);

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
            continueStory();
        }
    }, [continueStory]);

    return {
        pages,
        currentChoices,
        makeChoice,
        isEnded,
        resetStory
    };
};

export default useInkStory;
