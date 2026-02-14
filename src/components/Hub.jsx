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
        </div>
    );
};

export default Hub;
