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

// Parse sources.txt format into a lookup object
const parseSources = (text) => {
    const sources = {};
    if (!text) return sources;
    
    const lines = text.split('\n');
    let currentNum = null;
    let currentTitle = null;
    
    for (const line of lines) {
        const trimmed = line.trim();
        
        // Skip comments and empty lines
        if (trimmed.startsWith('#') || trimmed === '') {
            continue;
        }
        
        // Check for [number]: title format
        const numMatch = trimmed.match(/^\[(\d+)\]:\s*(.+)$/);
        if (numMatch) {
            currentNum = numMatch[1];
            currentTitle = numMatch[2];
            continue;
        }
        
        // Check for url: format
        const urlMatch = trimmed.match(/^url:\s*(.+)$/);
        if (urlMatch && currentNum && currentTitle) {
            sources[currentNum] = {
                title: currentTitle,
                url: urlMatch[1]
            };
            currentNum = null;
            currentTitle = null;
        }
    }
    
    return sources;
};

const TopicView = ({ storyContent, storyId, storyTitle, parentStoryTitle, savedState, onClose, onHome, onNavigateToStory }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [sourcesData, setSourcesData] = useState({});
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

    // Load sources.txt for this story
    useEffect(() => {
        fetch(`/stories/${storyId}/sources.txt`)
            .then(res => res.ok ? res.text() : '')
            .then(text => setSourcesData(parseSources(text)))
            .catch(() => setSourcesData({}));
    }, [storyId]);

    useEffect(() => {
        currentPageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [pages]);

    // Extract source references [1], [2] etc from text
    const extractSourceRefs = (paragraphs) => {
        const refs = new Set();
        paragraphs.forEach(p => {
            const matches = p.text?.match(/\[(\d+)\]/g) || [];
            matches.forEach(m => {
                const num = m.match(/\d+/)[0];
                refs.add(num);
            });
        });
        return Array.from(refs).sort((a, b) => parseInt(a) - parseInt(b));
    };

    const renderParagraphs = (paragraphs) => {
        const elements = [];
        let textBatch = [];
        let batchStartIndex = 0;

        const flushTextBatch = (currentIndex) => {
            if (textBatch.length > 0) {
                // Batch all text together and parse as full markdown (supports lists, etc.)
                let combinedText = textBatch.join('\n');
                
                // Convert bullet point lines (• or -) to markdown list format
                // This ensures they render as proper lists with tight spacing
                combinedText = combinedText.replace(/^[•]\s*/gm, '- ');
                
                // Convert [n] references to clickable links if we have source data
                if (Object.keys(sourcesData).length > 0) {
                    combinedText = combinedText.replace(/\[(\d+)\]/g, (match, num) => {
                        const source = sourcesData[num];
                        if (source) {
                            return `<a href="${source.url}" target="_blank" rel="noopener noreferrer" class="inline-source-ref" title="${source.title}">[${num}]</a>`;
                        }
                        return match;
                    });
                }
                
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
                
                // Also add the paragraph's text if it has any (diagram and text can be on same paragraph)
                if (p.text && p.text.trim()) {
                    textBatch.push(p.text);
                }
            } else {
                // Add text to batch
                textBatch.push(p.text);
            }
        });

        // Flush any remaining text
        flushTextBatch(paragraphs.length);

        return elements;
    };

    const renderSources = (refNumbers) => {
        if (refNumbers.length === 0 || Object.keys(sourcesData).length === 0) return null;
        
        // Get sources that exist in sourcesData
        const validSources = refNumbers
            .filter(num => sourcesData[num])
            .map(num => ({ num, ...sourcesData[num] }));
        
        if (validSources.length === 0) return null;
        
        return (
            <div className={styles.sourcesContainer}>
                <div className={styles.sourcesLabel}>Sources:</div>
                {validSources.map((source) => (
                    <div key={source.num} className={styles.sourceItem}>
                        <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.sourceLink}
                        >
                            [{source.num}] {source.title}
                        </a>
                    </div>
                ))}
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

            <div className={styles.scrollContainer} key={Object.keys(sourcesData).length > 0 ? 'loaded' : 'loading'}>
                {pages.length > 0 && <div className={styles.historyHint} />}
                
                {pages.map((page, pageIdx) => {
                    const isCurrentPage = pageIdx === pages.length - 1;
                    const previousPage = pageIdx > 0 ? pages[pageIdx - 1] : null;
                    const showChoiceTitle = previousPage?.selectedChoiceText;
                    const pageSourceRefs = extractSourceRefs(page.paragraphs);
                    
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
                            
                            {/* Show sources after choices */}
                            {renderSources(pageSourceRefs)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TopicView;
