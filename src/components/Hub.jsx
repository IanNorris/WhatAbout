import React from 'react';
import styles from './Hub.module.css';
import { stories } from '../stories';

const Hub = ({ onSelectTopic }) => {
    return (
        <div className={styles.hubContainer}>
            <h1 className={styles.title}>Let's talk about...</h1>

            <div className={styles.topicList}>
                {stories.map(story => (
                    <button
                        key={story.id}
                        className={styles.topicButton}
                        onClick={() => onSelectTopic(story)}
                    >
                        <span className={styles.topicTitle}>{story.title}</span>
                        <span className={styles.topicDesc}>{story.description}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Hub;
