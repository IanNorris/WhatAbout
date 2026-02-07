import React, { useState, useEffect } from 'react';
import styles from './CloudBackground.module.css';

const CloudBackground = () => {
    const [timestamp, setTimestamp] = useState('');

    useEffect(() => {
        const updateTimestamp = () => {
            const now = new Date();
            const formatted = now.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).replace(',', '');
            setTimestamp(formatted);
        };
        
        updateTimestamp();
        const interval = setInterval(updateTimestamp, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.recIndicator}>
                <span className={styles.recDot}></span>
                REC
            </div>
            <div className={styles.timestamp}>{timestamp}</div>
            <div className={styles.cameraId}>CAM-01</div>
        </div>
    );
};

export default CloudBackground;
