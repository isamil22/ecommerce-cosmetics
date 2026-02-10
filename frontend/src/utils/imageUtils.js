export const getOptimizedImageUrl = (url, width, height) => {
    if (!url) return '';
    if (url.startsWith('data:')) return url; // Don't touch base64
    if (url.includes('blob:')) return url; // Don't touch blobs

    // Clean up URL but PRESERVE existing query parameters (like v=...)
    const [baseUrl, queryString] = url.split('?');
    const params = new URLSearchParams(queryString);

    if (width) params.set('w', width);
    if (height) params.set('h', height);

    const newQueryString = params.toString();
    return newQueryString ? `${baseUrl}?${newQueryString}` : baseUrl;
};
