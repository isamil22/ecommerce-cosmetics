/**
 * Formats a number as a price string in Moroccan Dirham (MAD).
 * @param {number} amount - The price amount.
 * @returns {string} - The formatted price string (e.g., "100.00 MAD").
 */
export const formatPrice = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '0.00 MAD';
    }
    return `${Number(amount).toFixed(2)} MAD`;
};
