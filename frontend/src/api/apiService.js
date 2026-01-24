// frontend/src/api/apiService.js
import axios from 'axios';

const apiService = axios.create({
    baseURL: '/api', // Use relative path - Vite proxy will handle the routing
});

// Add JWT token to every request if it exists
apiService.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Helper function to check if user is authenticated
const isAuthenticated = () => !!localStorage.getItem('token');

// --- UPDATED `createProduct` and `updateProduct` functions ---

export const createProduct = (formData) => {
    return apiService({
        method: 'post',
        url: '/products',
        data: formData,
        headers: {
            // Don't set Content-Type - let the browser set it automatically for multipart/form-data
            // This ensures proper boundary is set
        },
    });
};

export const updateProduct = (id, formData) => {
    return apiService({
        method: 'put',
        url: `/products/${id}`,
        data: formData,
        headers: {
            // Don't set Content-Type - let the browser set it automatically for multipart/form-data
            // This ensures proper boundary is set
        },
    });
};

// Quick update function for simple field updates (JSON data)
export const updateProductQuick = (id, productData) => {
    return apiService({
        method: 'put',
        url: `/products/${id}`,
        data: productData,
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

// --- UPDATED Cart Functions for Guest User Support ---

export const addToCart = async (productOrId, quantity, productVariantId) => {
    // Check if we are adding a virtual product (object) or standard product (ID)
    const isVirtual = typeof productOrId === 'object' && productOrId !== null;

    if (isAuthenticated()) {
        // User is authenticated, send request to the backend
        if (isVirtual) {
            const payload = {
                productId: null,
                quantity: quantity,
                productName: productOrId.productName || productOrId.title,
                price: productOrId.price,
                imageUrl: productOrId.imageUrl || productOrId.image,
                variantName: productOrId.variantName || productOrId.selectedVariant
            };
            const response = await apiService.post(`/cart/add`, payload);
            window.dispatchEvent(new Event('cartUpdated'));
            return response;
        } else {
            const response = await apiService.post(`/cart/add`, { productId: productOrId, quantity, productVariantId });
            window.dispatchEvent(new Event('cartUpdated'));
            return response;
        }
    } else {
        // User is a guest, handle cart in local storage
        try {
            const guestCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };

            if (isVirtual) {
                // Handle Virtual Product for Guest
                // Virtual items don't have IDs, so we use name/price as unique key?
                // Or generate a temp ID? For now, push as new item or group by name.

                const existingItemIndex = guestCart.items.findIndex(item =>
                    item.productId === null &&
                    item.productName === (productOrId.productName || productOrId.title) &&
                    item.price === productOrId.price
                );

                if (existingItemIndex > -1) {
                    guestCart.items[existingItemIndex].quantity += quantity;
                } else {
                    guestCart.items.push({
                        id: 'guest_' + Date.now() + Math.random().toString(36).substr(2, 9),
                        productId: null,
                        productVariantId: null,
                        productName: productOrId.productName || productOrId.title,
                        price: productOrId.price,
                        quantity,
                        imageUrl: productOrId.imageUrl || productOrId.image || null,
                        variantName: productOrId.variantName || productOrId.selectedVariant
                    });
                }
            } else {
                // Standard Product Logic (Existing)
                const productId = productOrId;
                const productResponse = await getProductById(productId); // Fetch product details
                const product = productResponse.data;

                // Find existing item with same product and variant
                const existingItemIndex = guestCart.items.findIndex(item =>
                    item.productId === productId && item.productVariantId === productVariantId
                );

                if (existingItemIndex > -1) {
                    // Update quantity of existing item
                    guestCart.items[existingItemIndex].quantity += quantity;
                } else {
                    // Add new item to cart
                    guestCart.items.push({
                        id: 'guest_' + Date.now() + Math.random().toString(36).substr(2, 9),
                        productId,
                        productVariantId,
                        productName: product.name,
                        price: product.price,
                        quantity,
                        imageUrl: product.images && product.images.length > 0 ? product.images[0] : null
                    });
                }
            }

            localStorage.setItem('cart', JSON.stringify(guestCart));
            localStorage.setItem('cart', JSON.stringify(guestCart));
            window.dispatchEvent(new Event('cartUpdated'));
            return Promise.resolve({ data: guestCart }); // Mock a successful response
        } catch (error) {
            console.error('Error adding to guest cart:', error);
            return Promise.reject(error);
        }
    }
};

export const getCart = () => {
    if (isAuthenticated()) {
        return apiService.get('/cart');
    } else {
        // Return guest cart from localStorage
        const guestCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
        return Promise.resolve({ data: guestCart });
    }
};

export const removeCartItem = async (productId, productVariantId) => {
    if (isAuthenticated()) {
        // If it's a numeric ID, it's likely a Cart Item ID (for authenticated users)
        // If it's a GUID or string, it might be something else.
        // However, the backend expects CartItem ID for authenticated users.
        const response = await apiService.delete(`/cart/${productId}`);
        window.dispatchEvent(new Event('cartUpdated'));
        return response;
    } else {
        // Remove from guest cart in localStorage
        const guestCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };

        // Filter out the item to remove
        // Try to match by ID first (best for guest items with generated IDs)
        // Fallback to productId/variantId match for legacy support
        guestCart.items = guestCart.items.filter(item => {
            if (item.id && item.id === productId) return false;
            return !(item.productId === productId && item.productVariantId === productVariantId);
        });

        localStorage.setItem('cart', JSON.stringify(guestCart));
        localStorage.setItem('cart', JSON.stringify(guestCart));
        window.dispatchEvent(new Event('cartUpdated'));
        return Promise.resolve({ data: guestCart });
    }
};

export const updateCartItemQuantity = async (cartItemId, quantity) => {
    if (isAuthenticated()) {
        const response = await apiService.put(`/cart/${cartItemId}`, { quantity });
        window.dispatchEvent(new Event('cartUpdated'));
        return response;
    } else {
        // Guest Cart Logic
        try {
            const guestCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
            const itemIndex = guestCart.items.findIndex(item =>
                item.id === cartItemId || item.productId === cartItemId
            );

            if (itemIndex > -1) {
                if (quantity < 1) {
                    guestCart.items.splice(itemIndex, 1);
                } else {
                    guestCart.items[itemIndex].quantity = quantity;
                }
                localStorage.setItem('cart', JSON.stringify(guestCart));
                localStorage.setItem('cart', JSON.stringify(guestCart));
                window.dispatchEvent(new Event('cartUpdated'));
                return Promise.resolve({ data: guestCart });
            }
            return Promise.reject(new Error("Item not found in guest cart"));
        } catch (error) {
            return Promise.reject(error);
        }
    }
};

export const clearCart = () => {
    if (isAuthenticated()) {
        return apiService.delete('/cart/clear');
    } else {
        // Clear guest cart
        localStorage.removeItem('cart');
        return Promise.resolve({ data: { items: [] } });
    }
};

// Function to merge guest cart with user cart after login
export const mergeGuestCartWithUserCart = async () => {
    const guestCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };

    if (guestCart.items.length > 0 && isAuthenticated()) {
        try {
            // Add each guest cart item to the user's cart
            for (const item of guestCart.items) {
                await apiService.post(`/cart/add`, {
                    productId: item.productId,
                    quantity: item.quantity,
                    productVariantId: item.productVariantId
                });
            }

            // Clear guest cart after successful merge
            localStorage.removeItem('cart');

            return true;
        } catch (error) {
            console.error('Error merging guest cart with user cart:', error);
            return false;
        }
    }

    return false;
};

// --- Other existing functions ---

export const getAllProducts = (params) => {
    return apiService.get('/products', { params });
};

export const getProductById = async (id) => {
    try {
        const response = await apiService.get(`/products/${id}`);
        // Ensure the response has the expected structure
        if (!response.data) {
            throw new Error('Invalid product data received from server');
        }
        // Ensure images is always an array
        if (!Array.isArray(response.data.images)) {
            response.data.images = [];
        }
        // Ensure variants exists if hasVariants is true
        if (response.data.hasVariants && !Array.isArray(response.data.variants)) {
            response.data.variants = [];
        }
        return response;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error; // Re-throw to be handled by the component
    }
};

export const getHelloMessage = () => {
    return apiService.get('/hello');
};

export const registerUser = (userData) => {
    return apiService.post('/auth/register', userData);
};

export const loginUser = (credentials) => {
    return apiService.post('/auth/login', credentials);
};

export const confirmEmail = (confirmationData) => {
    return apiService.post('/auth/confirm-email', confirmationData);
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    // Clear guest cart on logout
    localStorage.removeItem('cart');
};

export const getUserProfile = () => {
    return apiService.get('/auth/user/profile');
};

export const getUserOrders = () => {
    return apiService.get('/orders/user');
};

export const getBestsellers = () => {
    return apiService.get('/products/bestsellers');
};

export const getNewArrivals = () => {
    return apiService.get('/products/new-arrivals');
};

export const deleteProduct = (id) => {
    return apiService.delete(`/products/${id}`);
};

export const getAllCategories = () => {
    return apiService.get('/categories');
};

export const createCategory = (formData) => {
    return apiService.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const updateCategory = (id, formData) => {
    return apiService.put(`/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const deleteCategory = (id) => {
    return apiService.delete(`/categories/${id}`);
};

export const getAllOrders = () => {
    return apiService.get('/orders');
};

export const updateOrderStatus = (orderId, status) => {
    return apiService.put(`/orders/${orderId}/status?status=${status}`);
};

export const getAllUsers = () => {
    return apiService.get('/users');
};

export const updateUserRole = (userId, role) => {
    return apiService.put(`/users/${userId}/role?role=${role}`);
};

export const deleteUser = (userId) => {
    return apiService.delete(`/users/${userId}`);
};

export const addReview = (reviewData) => {
    return apiService.post('/reviews', reviewData);
};

export const getApprovedReviews = () => {
    return apiService.get('/reviews/approved');
};

export const getPendingReviews = () => {
    return apiService.get('/reviews/pending');
};

export const approveReview = (reviewId) => {
    return apiService.put(`/reviews/${reviewId}/approve`);
};

export const deleteReview = (reviewId) => {
    return apiService.delete(`/reviews/${reviewId}`);
};

// Admin creates a review
export const createAdminReview = (reviewData) => {
    return apiService.post('/reviews/admin', reviewData);
};

// Admin updates a review
export const updateReview = (reviewId, reviewData) => {
    return apiService.put(`/reviews/${reviewId}`, reviewData);
};

// Admin gets all reviews (approved and pending)
export const getAllReviews = () => {
    return apiService.get('/reviews/all');
};

export const getHero = () => {
    return apiService.get('/hero');
};

export const updateHero = (formData) => {
    return apiService.put('/hero', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const addComment = (id, commentData, type = 'product') => {
    return apiService.post(`/comments/${type}/${id}`, commentData);
};

export const forgotPassword = (email) => {
    return apiService.post('/auth/forgot-password', { email });
};

export const resetPassword = (token, newPassword) => {
    return apiService.post('/auth/reset-password', { token, newPassword });
};

export const uploadDescriptionImage = (formData) => {
    return apiService.post('/products/description-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const createPack = (formData) => apiService.post('/packs', formData);

export const updatePack = (id, formData) => {
    return apiService.put(`/packs/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getAllPacks = () => {
    return apiService.get('/packs');
};

export const getPackById = (id) => {
    return apiService.get(`/packs/${id}`);
};
export const updateDefaultProductForPack = (packId, itemId, productId) => {
    return apiService.put(`/packs/${packId}/items/${itemId}/default-product`, { productId });
};

export const deletePack = (id) => {
    return apiService.delete(`/packs/${id}`);
};

// Pack Recommendations API Functions
export const updatePackRecommendations = (packId, data) => {
    return apiService.put(`/packs/${packId}/recommendations`, data);
};

export const updatePackProductRecommendations = (packId, productIds) => {
    return apiService.put(`/packs/${packId}/recommendations/products`, productIds);
};

export const updatePackPackRecommendations = (packId, packIds) => {
    return apiService.put(`/packs/${packId}/recommendations/packs`, packIds);
};

export const updatePackCustomPackRecommendations = (packId, customPackIds) => {
    return apiService.put(`/packs/${packId}/recommendations/custom-packs`, customPackIds);
};

export const createOrder = (orderData) => {
    const params = new URLSearchParams();
    params.append('clientFullName', orderData.clientFullName);
    params.append('city', orderData.city);
    params.append('address', orderData.address);
    params.append('phoneNumber', orderData.phoneNumber);
    if (orderData.couponCode) {
        params.append('couponCode', orderData.couponCode);
    }
    return apiService.post(`/orders?${params.toString()}`);
};

export const createDirectOrder = (orderData) => {
    return apiService.post('/orders/direct', orderData);
};

export const createGuestOrder = (orderData) => {
    return apiService.post('/orders/guest', orderData);
};

export const deleteOrder = (orderId) => {
    return apiService.delete(`/orders/${orderId}`);
};

export const deleteAllOrders = () => {
    return apiService.delete('/orders/all');
};

export const getOrderById = (orderId) => {
    return apiService.get(`/orders/${orderId}`);
};

export const getDeletedOrders = () => {
    return apiService.get('/orders/deleted');
};

export const restoreOrder = (orderId) => {
    return apiService.post(`/orders/${orderId}/restore`);
};

export const exportOrders = () => {
    return apiService.get('/orders/export', {
        responseType: 'blob',
    });
};

// ===== ORDER FEEDBACK API FUNCTIONS =====

export const submitOrderFeedback = (orderId, rating, comment = '') => {
    const params = new URLSearchParams();
    params.append('rating', rating);
    if (comment) {
        params.append('comment', comment);
    }
    return apiService.post(`/orders/${orderId}/feedback`, params);
};

export const submitGuestOrderFeedback = (orderId, rating, comment = '') => {
    const params = new URLSearchParams();
    params.append('rating', rating);
    if (comment) {
        params.append('comment', comment);
    }
    return apiService.post(`/orders/${orderId}/feedback/guest`, params);
};

export const getOrderFeedback = (orderId) => {
    return apiService.get(`/orders/${orderId}/feedback`);
};

export const getAllOrderFeedback = () => {
    return apiService.get('/orders/feedback');
};

export const getOrderFeedbackByRating = (rating) => {
    return apiService.get(`/orders/feedback/rating/${rating}`);
};

export const createCoupon = (couponData) => {
    return apiService.post('/coupons', couponData);
};

export const updateCoupon = (id, couponData) => {
    return apiService.put(`/coupons/${id}`, couponData);
};

export const validateCoupon = (code) => {
    return apiService.get(`/coupons/validate/${code}`);
};

export const getAllCoupons = () => {
    return apiService.get('/coupons');
};

export const deleteCoupon = (id) => {
    return apiService.delete(`/coupons/${id}`);
};

export const getCouponUsageStatistics = () => {
    console.log('🔍 Fetching general coupon usage statistics...');
    return apiService.get('/coupons/usage-statistics')
        .then(response => {
            console.log('✅ General usage statistics response:', response.data);
            return response;
        })
        .catch(error => {
            console.error('❌ Error fetching general usage statistics:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        });
};

export const getCouponUsageStatisticsById = (couponId) => {
    console.log(`🔍 Fetching usage statistics for coupon ID: ${couponId}`);
    return apiService.get(`/coupons/${couponId}/usage-statistics`)
        .then(response => {
            console.log(`✅ Usage statistics for coupon ${couponId}:`, response.data);
            return response;
        })
        .catch(error => {
            console.error(`❌ Error fetching usage statistics for coupon ${couponId}:`, {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        });
};

export const getProductSuggestions = (query) => {
    return apiService.get('/products/suggestions', { params: { query } });
};

export const getAnnouncement = () => {
    return apiService.get('/announcement');
};

export const updateAnnouncement = (announcementData) => {
    return apiService.put('/announcement', announcementData);
};

export const getCountdown = () => {
    return apiService.get('/countdown');
};

export const createCustomPack = (customPackData) => {
    return apiService.post('/custom-packs', customPackData);
};

export const getAllCustomPacks = () => {
    return apiService.get('/custom-packs');
};

export const getCustomPackById = (id) => {
    return apiService.get(`/custom-packs/${id}`);
};

export const updateCustomPack = (id, customPackData) => {
    return apiService.put(`/custom-packs/${id}`, customPackData);
};

export const deleteCustomPack = (id) => {
    return apiService.delete(`/custom-packs/${id}`);
};

export const getPackableProducts = () => {
    return apiService.get('/products/packable');
};

export const getAllowedProductsForCustomPack = (customPackId) => {
    return apiService.get(`/custom-packs/${customPackId}/allowed-products`);
};

export const saveCountdown = (countdownData) => {
    return apiService.post('/countdown', countdownData);
};

export const getFrequentlyBoughtTogether = (productId) => {
    return apiService.get(`/products/${productId}/frequently-bought-together`);
};

export const updateFrequentlyBoughtTogether = (productId, frequentlyBoughtIds) => {
    return apiService.put(`/products/${productId}/frequently-bought-together`, frequentlyBoughtIds);
};

export const addAdminComment = (id, formData, type = 'product') => {
    return apiService.post(`/comments/admin/${type}/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getAllComments = () => {
    return apiService.get('/comments');
};

export const updateComment = (commentId, formData) => {
    return apiService.put(`/comments/${commentId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteComment = (commentId) => {
    return apiService.delete(`/comments/${commentId}`);
};

export const deleteCommentImage = (commentId, imageUrl) => {
    return apiService.delete(`/comments/${commentId}/images`, { params: { imageUrl } });
};

// Pack-specific comment functions
export const updatePackComment = (commentId, formData) => {
    return apiService.put(`/comments/pack/${commentId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deletePackComment = (commentId) => {
    return apiService.delete(`/comments/pack/${commentId}`);
};

// Product-specific comment functions
export const updateProductComment = (commentId, formData) => {
    return apiService.put(`/comments/product/${commentId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteProductComment = (commentId) => {
    return apiService.delete(`/comments/product/${commentId}`);
};

// Settings API functions
export const getSettings = () => {
    return apiService.get('/settings');
};

export const saveSettings = (settings) => {
    return apiService.post('/settings', settings);
};

export default apiService;