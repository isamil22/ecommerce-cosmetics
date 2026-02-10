export const getOptimizedImageUrl = (url, width, height) => {
    if (!url) return '';
    if (url.startsWith('data:')) return url; // Don't touch base64
    if (url.includes('blob:')) return url; // Don't touch blobs

    // Clean up URL but PRESERVE existing query parameters (like v=...)
    const [baseUrl, queryString] = url.split('?');

    // Encode the URL to handle spaces (e.g. "New Arrivals.jpg" -> "New%20Arrivals.jpg")
    // encodeURI preserves sensitive characters like / and : but encodes spaces
    const encodedBaseUrl = encodeURI(baseUrl);

    const params = new URLSearchParams(queryString);

    if (width) params.set('w', width);
    if (height) params.set('h', height);

    const newQueryString = params.toString();
    return newQueryString ? `${encodedBaseUrl}?${newQueryString}` : encodedBaseUrl;
};
