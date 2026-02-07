export const getOptimizedImageUrl = (url, width, height) => {
    if (!url) return '';
    if (url.startsWith('data:')) return url; // Don't touch base64
    if (url.includes('blob:')) return url; // Don't touch blobs

    // Clean up URL
    const baseUrl = url.split('?')[0];
    const params = [];

    if (width) params.push(`w=${width}`);
    if (height) params.push(`h=${height}`);

    return params.length > 0 ? `${baseUrl}?${params.join('&')}` : baseUrl;
};
