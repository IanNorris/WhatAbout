import React, { useEffect, useRef, useState } from 'react';
import useInkStory from '../hooks/useInkStory';
import OverlayMenu from './OverlayMenu';
import styles from './TopicView.module.css';

const TopicView = ({ storyContent, storyId, onClose, onHome }) => {
    const { pages, currentChoices, makeChoice, resetStory } = useInkStory(storyContent, onHome);
    const currentPageRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        currentPageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [pages, currentChoices]);

    const renderParagraph = (p, index) => {
        const diagramTag = p.tags?.find(t => t.startsWith('diagram:'));
        let diagram = null;

        if (diagramTag) {
            const src = diagramTag.split(':')[1].trim();
            // Prepend story ID to make path relative to assets/<story-id>/
            const imagePath = `/assets/${storyId}/${src}`;
            diagram = (
                <div className="diagram-container" style={{ margin: '1rem 0', textAlign: 'center' }}>
                    <img src={imagePath} alt="Diagram" style={{ maxWidth: '100%', borderRadius: '10px' }} />
                </div>
            );
        }

        return (
            <div key={index} className={styles.textBlock}>
                {p.text}
                {diagram}
            </div>
        );
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
                onRestart={() => {
                    resetStory();
                    setIsMenuOpen(false);
                }}
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
                            
                            {page.paragraphs.map((p, pIdx) => renderParagraph(p, `${pageIdx}-${pIdx}`))}
                            
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
