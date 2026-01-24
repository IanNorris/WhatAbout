import React from 'react';
import styles from './CloudBackground.module.css';

const CloudBackground = () => {
    return (
        <div className={styles.container}>
            <div className={styles.cloud}></div>
            <div className={styles.cloud}></div>
            <div className={styles.cloud}></div>
        </div>
    );
};

export default CloudBackground;
