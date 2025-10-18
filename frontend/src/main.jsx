// frontend/src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { HelmetProvider } from 'react-helmet-async';
import { PermissionProvider } from './contexts/PermissionContext';
import ReactGA from 'react-ga4';

// Initialize Google Analytics
const GA_TRACKING_ID = 'G-T78R8VV7E4';
ReactGA.initialize(GA_TRACKING_ID);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.Fragment>
        <HelmetProvider>
            <PermissionProvider>
                <App />
            </PermissionProvider>
        </HelmetProvider>
    </React.Fragment>
);