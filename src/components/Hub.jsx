import React, { useState, useEffect } from 'react';
import styles from './Hub.module.css';
import { loadStoryList, loadInkStory } from '../stories';

// Story categories for visual grouping
const STORY_CATEGORIES = {
    featured: ['big-picture'],
    legislation: ['childrens-wellbeing-bill'],
    core: ['age-verification', 'social-media-bans', 'digital-id'],
    technical: ['vpn-bans', 'on-device-scanning', 'facial-recognition'],
    solutions: ['better-parental-controls']
};

// Icons for each story (using emoji for simplicity - could be replaced with SVGs)
const STORY_ICONS = {
    'big-picture': '🔗',
    'childrens-wellbeing-bill': '📜',
    'age-verification': '🪪',
    'social-media-bans': '📱',
    'vpn-bans': '🔒',
    'digital-id': '🆔',
    'on-device-scanning': '👁️',
    'better-parental-controls': '👨‍👩‍👧',
    'facial-recognition': '📷'
};

const Hub = ({ onSelectTopic }) => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingStoryId, setLoadingStoryId] = useState(null);
    const [error, setError] = useState(null);

    // Load story list on mount
    useEffect(() => {
        async function fetchStories() {
            try {
                const storyList = await loadStoryList();
                setStories(storyList);
            } catch (err) {
                setError(`Failed to load story list: ${err.message}`);
            }
        }
        fetchStories();
    }, []);

    const handleSelectTopic = async (story) => {
        setLoading(true);
        setLoadingStoryId(story.id);
        setError(null);
        
        try {
            const compiledStory = await loadInkStory(story.inkPath);
            onSelectTopic({
                ...story,
                content: compiledStory
            });
        } catch (err) {
            setError(err.message);
            console.error('Story loading error:', err);
        } finally {
            setLoading(false);
            setLoadingStoryId(null);
        }
    };

    const getStoriesByCategory = (categoryIds) => {
        return stories.filter(s => categoryIds.includes(s.id));
    };

    const featuredStory = stories.find(s => s.id === 'big-picture');
    const legislationStories = getStoriesByCategory(STORY_CATEGORIES.legislation);
    const coreStories = getStoriesByCategory(STORY_CATEGORIES.core);
    const technicalStories = getStoriesByCategory(STORY_CATEGORIES.technical);
    const solutionStories = getStoriesByCategory(STORY_CATEGORIES.solutions);

    const renderStoryCard = (story, isFeatured = false) => (
        <button
            key={story.id}
            className={`${styles.topicButton} ${isFeatured ? styles.featuredButton : ''}`}
            onClick={() => handleSelectTopic(story)}
            disabled={loading}
        >
            <span className={styles.topicIcon}>{STORY_ICONS[story.id] || '📖'}</span>
            <div className={styles.topicContent}>
                <span className={styles.topicTitle}>{story.title}</span>
                <span className={styles.topicDesc}>{story.description}</span>
            </div>
            {loadingStoryId === story.id && (
                <span className={styles.loadingIndicator}>Loading...</span>
            )}
        </button>
    );

    return (
        <div className={styles.hubContainer}>
            <header className={styles.header}>
                <span className={styles.preTitle}>Won't someone...</span>
                <h1 className={styles.title}>Think of the Kids</h1>
                <p className={styles.subtitle}>
                    Understanding the unintended consequences of digital safety laws in the name of child safety
                </p>
            </header>

            {error && (
                <div className={styles.errorBox}>
                    <div className={styles.errorTitle}>⚠️ Story Loading Error</div>
                    {error}
                </div>
            )}

            <div className={styles.storiesContainer}>
                {/* Featured Story */}
                {featuredStory && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Start Here</h2>
                        {renderStoryCard(featuredStory, true)}
                    </section>
                )}

                {/* Current Legislation */}
                {legislationStories.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Current Legislation</h2>
                        <div className={styles.topicGrid}>
                            {legislationStories.map(story => renderStoryCard(story))}
                        </div>
                    </section>
                )}

                {/* Core Issues */}
                {coreStories.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>The Core Issues</h2>
                        <div className={styles.topicGrid}>
                            {coreStories.map(story => renderStoryCard(story))}
                        </div>
                    </section>
                )}

                {/* Technical Deep Dives */}
                {technicalStories.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Technical Reality</h2>
                        <div className={styles.topicGrid}>
                            {technicalStories.map(story => renderStoryCard(story))}
                        </div>
                    </section>
                )}

                {/* Solutions */}
                {solutionStories.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>What Actually Works</h2>
                        <div className={styles.topicGrid}>
                            {solutionStories.map(story => renderStoryCard(story))}
                        </div>
                    </section>
                )}
            </div>

            <footer className={styles.footer}>
                <p>
                    This site was created by concerned citizens acting independently of any political party or interest group.
                    Developed with AI assistance but fact-checked by humans. All claims are sourced.
                </p>
            </footer>

            <a
                href="https://github.com/ThinkOfTheKids/WhatAbout"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    position: 'fixed',
                    bottom: '12px',
                    right: '12px',
                    zIndex: 1000,
                    opacity: 0.4,
                    transition: 'opacity 0.2s ease',
                    lineHeight: 0,
                }}
                title="View source on GitHub"
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.4'}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
            </a>
        </div>
    );
};

export default Hub;
