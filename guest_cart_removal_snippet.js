// Simplified guest cart removal handler
const handleRemoveItem = async (item, index) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟ / Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        return;
    }

    try {
        setRemovingItemId(item.id || index);

        if (isAuthenticated) {
            // Authenticated: API call
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart/${item.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to remove');

            const updatedCart = await getCart();
            setCart(updatedCart.data);
        } else {
            // Guest: localStorage
            const guestCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
            guestCart.items = guestCart.items.filter((_, idx) => idx !== index);
            localStorage.setItem('cart', JSON.stringify(guestCart));
            setCart(guestCart);
        }

        // Reset coupon
        if (appliedCoupon) {
            setDiscount(0);
            setAppliedCoupon(null);
            setCouponCode('');
        }

        toast.success('✓ تم حذف المنتج بنجاح / Produit supprimé avec succès');

        // Redirect if empty
        if (cart.items.length <= 1) {
            setTimeout(() => navigate('/products'), 1500);
        }
    } catch (err) {
        console.error(err);
        toast.error('❌ فشل حذف المنتج / Échec de la suppression du produit');
    } finally {
        setRemovingItemId(null);
    }
};

// In button: onClick={() => handleRemoveItem(item, index)}
