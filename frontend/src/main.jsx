// frontend/src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { HelmetProvider } from 'react-helmet-async';
import { PermissionProvider } from './contexts/PermissionContext';
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