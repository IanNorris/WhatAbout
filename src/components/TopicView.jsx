import React, { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';
import useInkStory from '../hooks/useInkStory';
import OverlayMenu from './OverlayMenu';
import DebugKnotViewer from './DebugKnotViewer';
import styles from './TopicView.module.css';

// Configure marked to use inline rendering without wrapping in <p> tags
marked.use({
    breaks: true,
    gfm: true,
});

const TopicView = ({ storyContent, storyId, storyTitle, parentStoryTitle, savedState, onClose, onHome, onNavigateToStory }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { pages, currentChoices, makeChoice, resetStory, currentKnot, availableKnots, navigateToKnot } = useInkStory(
        storyContent,
        storyId,
        storyTitle,
        savedState,
        onHome,
        (storyState, newStory) => {
            setIsMenuOpen(false); // Close menu when navigating
            onNavigateToStory(storyState, newStory);
        }
    );
    const currentPageRef = useRef(null);

    useEffect(() => {
        currentPageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [pages]);

    const renderParagraphs = (paragraphs) => {
        const elements = [];
        let textBatch = [];
        let batchStartIndex = 0;

        const flushTextBatch = (currentIndex) => {
            if (textBatch.length > 0) {
                // Batch all text together and parse as full markdown (supports lists, etc.)
                const combinedText = textBatch.join('\n');
                const htmlContent = marked.parse(combinedText);
                
                elements.push(
                    <div key={`text-${batchStartIndex}`} className={styles.textBlock}>
                        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    </div>
                );
                textBatch = [];
                batchStartIndex = currentIndex;
            }
        };

        paragraphs.forEach((p, index) => {
            const diagramTag = p.tags?.find(t => t.startsWith('diagram:'));

            if (diagramTag) {
                // Flush any pending text before adding the diagram
                flushTextBatch(index);

                const src = diagramTag.split(':')[1].trim();
                const imagePath = `/assets/${storyId}/${src}`;
                elements.push(
                    <div key={`diagram-${index}`} className="diagram-container" style={{ margin: '1rem 0', textAlign: 'center' }}>
                        <img src={imagePath} alt="Diagram" style={{ maxWidth: '100%', borderRadius: '10px' }} />
                    </div>
                );
            } else {
                // Add text to batch
                textBatch.push(p.text);
            }
        });

        // Flush any remaining text
        flushTextBatch(paragraphs.length);

        return elements;
    };

    return (
        <div className={styles.container}>
            <button className={styles.closeButton} onClick={() => setIsMenuOpen(true)} aria-label="Open Menu">
                &times;
            </button>

            <OverlayMenu
                visible={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onHome={onHome}
                onBack={parentStoryTitle ? () => {
                    setIsMenuOpen(false);
                    onClose();
                } : null}
                parentStoryTitle={parentStoryTitle}
                currentStoryTitle={storyTitle}
                onRestart={() => {
                    resetStory();
                    setIsMenuOpen(false);
                }}
            />

            <DebugKnotViewer
                currentKnot={currentKnot}
                availableKnots={availableKnots}
                onNavigateToKnot={navigateToKnot}
            />

            <div className={styles.scrollContainer}>
                {pages.length > 0 && <div className={styles.historyHint} />}
                
                {pages.map((page, pageIdx) => {
                    const isCurrentPage = pageIdx === pages.length - 1;
                    const previousPage = pageIdx > 0 ? pages[pageIdx - 1] : null;
                    const showChoiceTitle = previousPage?.selectedChoiceText;
                    
                    return (
                        <div
                            key={pageIdx}
                            ref={isCurrentPage ? currentPageRef : null}
                            className={`${styles.pageCard} ${isCurrentPage ? styles.currentPage : styles.historyPage}`}
                        >
                            {showChoiceTitle && (
                                <div className={styles.choiceTitle}>
                                    You chose: {previousPage.selectedChoiceText}
                                </div>
                            )}
                            
                            {renderParagraphs(page.paragraphs)}
                            
                            {/* Show choices if they exist on this page */}
                            {page.choices && page.choices.length > 0 && (
                                <div className={styles.choicesContainer}>
                                    {page.choices.map((choiceText, idx) => {
                                        const isSelected = page.selectedChoiceIndex === idx;
                                        const isDisabled = page.selectedChoiceIndex !== null && !isSelected;
                                        
                                        return (
                                            <button
                                                key={idx}
                                                className={`${styles.choiceButton} ${
                                                    isSelected ? styles.chosenButton : ''
                                                } ${isDisabled ? styles.disabledButton : ''}`}
                                                disabled={isDisabled}
                                            >
                                                {choiceText}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                            
                            {/* Show live choices on current page */}
                            {isCurrentPage && currentChoices.length > 0 && (
                                <div className={styles.choicesContainer}>
                                    {currentChoices.map((choice, idx) => (
                                        <button
                                            key={idx}
                                            className={styles.choiceButton}
                                            onClick={() => makeChoice(idx)}
                                        >
                                            {choice.text}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TopicView;
