import React from 'react';
import CloudBackground from './CloudBackground';

const layoutStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const Layout = ({ children }) => {
    return (
        <div style={layoutStyle}>
            <CloudBackground />
            <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
                {children}
            </div>
        </div>
    );
};

export default Layout;
