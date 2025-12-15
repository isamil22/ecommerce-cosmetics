export const initPixel = () => {
    // This is handled by the FacebookPixel.jsx component
    // We just need to ensure fbq exists
    if (!window.fbq) {
        console.warn('Facebook Pixel not initialized yet.');
    }
};

export const trackEvent = (eventName, params = {}) => {
    if (window.fbq) {
        window.fbq('track', eventName, params);
    } else {
        console.debug(`[FB Pixel] would track '${eventName}'`, params);
    }
};

export const trackCustomEvent = (eventName, params = {}) => {
    if (window.fbq) {
        window.fbq('trackCustom', eventName, params);
    } else {
        console.debug(`[FB Pixel] would track custom '${eventName}'`, params);
    }
};
