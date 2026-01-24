// frontend/src/App.jsx
import { SiteSettingsProvider } from './context/SiteSettingsContext.jsx';

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import HelloPage from './pages/HelloPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import CartPage from './pages/CartPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import UserOrdersPage from './pages/UserOrdersPage.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import AdminProductForm from './pages/admin/AdminProductForm.jsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';
import AdminReviewsPage from './pages/admin/AdminReviewsPage.jsx';
import { getCart, getUserProfile } from './api/apiService.js';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import EmailConfirmationPage from './pages/EmailConfirmationPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import FaqPage from './pages/FaqPage.jsx';
import ShippingPage from './pages/ShippingPage.jsx';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage.jsx';
import AdminCategoryForm from './pages/admin/AdminCategoryForm.jsx';
import AdminHeroPage from './pages/admin/AdminHeroPage.jsx';
import AdminPackForm from './pages/admin/AdminPackForm.jsx';
import AdminPacksPage from './pages/admin/AdminPacksPage.jsx';
import PacksPage from "./pages/PacksPage.jsx";
import PackDetailPage from "./pages/PackDetailPage.jsx";
import AdminPackEditPage from './pages/admin/AdminPackEditPage.jsx';
import AdminCouponsPage from './pages/admin/AdminCouponsPage.jsx';
import AdminBrandSettingsPage from './pages/admin/AdminBrandSettingsPage.jsx';
import AdminIntegrationsPage from './pages/admin/AdminIntegrationsPage.jsx';
import EnhancedVisitorCounterSettingsPage from './pages/admin/EnhancedVisitorCounterSettingsPage.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FacebookPixel from './components/FacebookPixel.jsx';
import GoogleAnalytics from './components/GoogleAnalytics.jsx';
import AnalyticsTracker from './components/AnalyticsTracker.jsx';
import AnnouncementBar from './components/AnnouncementBar.jsx';
import FloatingActionButton from './components/FloatingActionButton.jsx';
import StickyCartButton from './components/landingPage/StickyCartButton.jsx';
import AdminAnnouncementPage from './pages/admin/AdminAnnouncementPage.jsx';
import AdminCountdownPage from './pages/admin/AdminCountdownPage.jsx';
import AdminCustomPackForm from './pages/admin/AdminCustomPackForm';
import AdminCustomPacksPage from './pages/admin/AdminCustomPacksPage';
import CustomPacksPage from './pages/CustomPacksPage';
import CustomPackCreationPage from './pages/CustomPackCreationPage';
import AdminProductCommentsPage from './pages/admin/AdminProductCommentsPage.jsx';
import AdminPackCommentsPage from './pages/admin/AdminPackCommentsPage.jsx';
import AdminPackRecommendationsPage from './pages/admin/AdminPackRecommendationsPage.jsx';
import ReviewFormSettingsPage from './pages/admin/ReviewFormSettingsPage.jsx';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage.jsx';
import AdminRolesPage from './pages/admin/AdminRolesPage.jsx';
import AdminPermissionsPage from './pages/admin/AdminPermissionsPage.jsx';
import AdminLandingPagesPage from './pages/admin/AdminLandingPagesPage.jsx';
import AdminLandingPageBuilder from './pages/admin/AdminLandingPageBuilder.jsx';
import PublicLandingPage from './pages/PublicLandingPage.jsx';

import NotFoundPage from './pages/NotFoundPage.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [cartCount, setCartCount] = useState(0);

    const fetchCartCount = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await getCart();
                const items = response.data?.items || [];
                const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(totalItems);
            } catch (error) {
                console.error("Failed to fetch cart for count:", error);
                setCartCount(0);
            }
        } else {
            const guestCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
            const totalItems = guestCart.items.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(totalItems);
        }
    };

    useEffect(() => {
        const checkAuthAndFetchRole = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setIsAuthenticated(true);
                try {
                    const response = await getUserProfile();
                    setUserRole(response.data.effectiveRole);
                } catch (error) {
                    console.error("Could not fetch user profile", error);
                    setIsAuthenticated(false);
                    setUserRole(null);
                    localStorage.removeItem('token');
                }
            } else {
                setIsAuthenticated(false);
                setUserRole(null);
            }
        };

        checkAuthAndFetchRole();
        fetchCartCount();

        // Listen for global cart update events (triggered by apiService)
        const handleCartUpdate = () => {
            console.log("Cart update event received, refreshing count...");
            fetchCartCount();
        };
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [isAuthenticated]);

    const handleSetIsAuthenticated = (authStatus) => {
        setIsAuthenticated(authStatus);
        if (!authStatus) {
            setUserRole(null);
        }
    };

    return (

        <BrowserRouter>
            <ScrollToTop />
            <SiteSettingsProvider>
                {/* AnnouncementBar */}
                <AnnouncementBar />


                <div
                    className="flex flex-col min-h-screen overflow-x-hidden w-full relative"
                    style={{ paddingTop: 'var(--announcement-bar-height, 0px)', transition: 'padding-top 0.3s ease' }}
                >
                    <FacebookPixel />
                    <GoogleAnalytics />
                    <AnalyticsTracker />
                    <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={handleSetIsAuthenticated} userRole={userRole} cartCount={cartCount} />
                    <ToastContainer
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                    <main className="flex-grow">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/products" element={<ProductsPage />} />
                            <Route path="/packs" element={<PacksPage />} />
                            <Route path="/packs/:id" element={<PackDetailPage isAuthenticated={isAuthenticated} fetchCartCount={fetchCartCount} />} />
                            <Route path="/custom-packs" element={<CustomPacksPage />} />
                            <Route path="/custom-packs/:id" element={<CustomPackCreationPage />} />
                            <Route path="/products/:id" element={<ProductDetailPage fetchCartCount={fetchCartCount} isAuthenticated={isAuthenticated} />} />
                            <Route path="/hello" element={<HelloPage />} />
                            <Route path="/auth" element={<AuthPage setIsAuthenticated={handleSetIsAuthenticated} />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                            <Route path="/confirm-email/:email" element={<EmailConfirmationPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/faq" element={<FaqPage />} />
                            <Route path="/shipping" element={<ShippingPage />} />

                            {/* Public Landing Pages */}
                            <Route path="/landing/:slug" element={<PublicLandingPage fetchCartCount={fetchCartCount} cartCount={cartCount} />} />

                            {/* Authenticated User Routes */}
                            {userRole !== 'ADMIN' && <Route path="/profile" element={<ProfilePage />} />}
                            {userRole !== 'ADMIN' && <Route path="/orders" element={<UserOrdersPage />} />}
                            <Route path="/cart" element={<CartPage fetchCartCount={fetchCartCount} />} />
                            <Route path="/order" element={<OrderPage />} />
                            <Route path="/order-success" element={<OrderSuccessPage />} />

                            {/* Admin-Only Routes */}
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route path="dashboard" element={<AdminDashboard />} />
                                <Route path="hero" element={<AdminHeroPage />} />
                                <Route path="products" element={<AdminProductsPage />} />
                                <Route path="products/new" element={<AdminProductForm />} />
                                <Route path="products/edit/:id" element={<AdminProductForm />} />
                                <Route path="products/:productId/comments" element={<AdminProductCommentsPage />} />
                                <Route path="orders" element={<AdminOrdersPage />} />
                                <Route path="users" element={<AdminUsersPage />} />
                                <Route path="reviews" element={<AdminReviewsPage />} />
                                <Route path="categories" element={<AdminCategoriesPage />} />
                                <Route path="categories/new" element={<AdminCategoryForm />} />
                                <Route path="categories/edit/:id" element={<AdminCategoryForm />} />
                                <Route path="packs" element={<AdminPacksPage />} />
                                <Route path="packs/new" element={<AdminPackForm />} />
                                <Route path="packs/edit/:id" element={<AdminPackEditPage />} />
                                <Route path="packs/:packId/comments" element={<AdminPackCommentsPage />} />
                                <Route path="packs/:packId/recommendations" element={<AdminPackRecommendationsPage />} />
                                <Route path="custom-packs" element={<AdminCustomPacksPage />} />
                                <Route path="custom-packs/new" element={<AdminCustomPackForm />} />
                                <Route path="custom-packs/edit/:id" element={<AdminCustomPackForm />} />
                                <Route path="coupons" element={<AdminCouponsPage />} />
                                <Route path="announcement" element={<AdminAnnouncementPage />} />
                                <Route path="countdown" element={<AdminCountdownPage />} />
                                <Route path="enhanced-visitor-counter" element={<EnhancedVisitorCounterSettingsPage />} />
                                <Route path="review-form-settings" element={<ReviewFormSettingsPage />} />
                                <Route path="analytics" element={<AdminAnalyticsPage />} />
                                <Route path="analytics" element={<AdminAnalyticsPage />} />
                                {/* <Route path="settings" element={<SettingsPage />} /> */}
                                <Route path="settings/brand" element={<AdminBrandSettingsPage />} />
                                <Route path="settings/integrations" element={<AdminIntegrationsPage />} />
                                <Route path="roles" element={<AdminRolesPage />} />
                                <Route path="permissions" element={<AdminPermissionsPage />} />
                                <Route path="landing-pages" element={<AdminLandingPagesPage />} />
                                <Route path="landing-pages/create" element={<AdminLandingPageBuilder />} />
                                <Route path="landing-pages/:id/edit" element={<AdminLandingPageBuilder />} />
                            </Route>


                            {/* Redirect admin users from profile and orders to dashboard */}
                            {userRole === 'ADMIN' && <Route path="/profile" element={<Navigate to="/admin/dashboard" replace />} />}
                            {userRole === 'ADMIN' && <Route path="/orders" element={<Navigate to="/admin/dashboard" replace />} />}

                            {/* 404 Route */}
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </main>
                    <Footer />

                    {/* Floating Action Button - Disabled for minimal design */}
                    {/* <FloatingActionButton cartCount={cartCount} /> */}

                    {/* Sticky Cart Button - Replaces FloatingActionButton */}
                    <StickyCartButton cartCount={cartCount} />
                </div>
            </SiteSettingsProvider>
        </BrowserRouter>
    );
}

export default App;
