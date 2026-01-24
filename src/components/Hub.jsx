import React, { useState, useEffect } from 'react';
import styles from './Hub.module.css';
import { loadStoryList, loadInkStory } from '../stories';

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
            // Load and compile the .ink file
            const compiledStory = await loadInkStory(story.inkPath);
            
            // Pass the compiled story to the parent
            onSelectTopic({
                ...story,
                content: compiledStory
            });
        } catch (err) {
            setError(`Failed to load story: ${err.message}`);
            console.error(err);
        } finally {
            setLoading(false);
            setLoadingStoryId(null);
        }
    };

    return (
        <div className={styles.hubContainer}>
            <h1 className={styles.title}>Let's talk about...</h1>

            {error && (
                <div style={{ color: '#f4a261', marginBottom: '1rem', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            <div className={styles.topicList}>
                {stories.map(story => (
                    <button
                        key={story.id}
                        className={styles.topicButton}
                        onClick={() => handleSelectTopic(story)}
                        disabled={loading}
                    >
                        <span className={styles.topicTitle}>{story.title}</span>
                        <span className={styles.topicDesc}>{story.description}</span>
                        {loadingStoryId === story.id && (
                            <span style={{ fontSize: '0.9rem', color: 'var(--color-accent)' }}>
                                Loading...
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Hub;
