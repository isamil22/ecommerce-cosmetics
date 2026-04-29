// frontend/src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { HelmetProvider } from 'react-helmet-async';
import { PermissionProvider } from './contexts/PermissionContext';
const container = document.getElementById('root');
const root = createRoot(container);

// Monkey-patch to fix React crashes caused by Google Translate and other extensions modifying the DOM.
// This intercepts NotFoundError during removeChild and insertBefore.
if (typeof Node === 'function' && Node.prototype) {
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function(child) {
        if (child.parentNode !== this) {
            if (console) console.warn('React Virtual DOM mismatch: node is not a child of this parent. Bypassing removeChild to prevent crash.');
            return child;
        }
        return originalRemoveChild.apply(this, arguments);
    };

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function(newNode, referenceNode) {
        if (referenceNode && referenceNode.parentNode !== this) {
            if (console) console.warn('React Virtual DOM mismatch: reference node is not a child of this parent. Bypassing insertBefore to prevent crash.');
            return newNode;
        }
        return originalInsertBefore.apply(this, arguments);
    };
}

root.render(
    <React.Fragment>
        <HelmetProvider>
            <PermissionProvider>
                <App />
            </PermissionProvider>
        </HelmetProvider>
    </React.Fragment>
);