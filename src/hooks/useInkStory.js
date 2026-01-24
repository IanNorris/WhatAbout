import { useState, useEffect, useRef, useCallback } from 'react';
import { Story } from 'inkjs';

const useInkStory = (storyContent) => {
    const [pages, setPages] = useState([]); // Array of pages, each page is an array of paragraphs
    const [currentChoices, setCurrentChoices] = useState([]);
    const [isEnded, setIsEnded] = useState(false);
    const [globalTags, setGlobalTags] = useState({});

    const storyRef = useRef(null);

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

        // Add new paragraphs as a new page
        if (newParagraphs.length > 0) {
            setPages(prev => [...prev, newParagraphs]);
        }

        if (s.currentChoices && s.currentChoices.length > 0) {
            setCurrentChoices(s.currentChoices);
        } else {
            setCurrentChoices([]);
            setIsEnded(true); // Or maybe just no choices?
        }
    }, []);

    const makeChoice = useCallback((index) => {
        const s = storyRef.current;
        if (!s) return;

        s.ChooseChoiceIndex(index);
        // Clear choices from view (optional, or keep history?)
        // Usually we want to keep the text history but clear the choices

        // Add the choice text itself to history? "What About" usually has seamless flow.
        // For now, let's just continue.

        setCurrentChoices([]);
        continueStory();
    }, [continueStory]);

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
