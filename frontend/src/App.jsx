// frontend/src/App.jsx - OPTIMIZED WITH CODE SPLITTING
import { SiteSettingsProvider } from './context/SiteSettingsContext.jsx';
import { LanguageProvider } from './contexts/LanguageContext.jsx';

import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
// LAZY LOAD PUBLIC COMPONENTS (Optimization)
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const ProductsPage = lazy(() => import('./pages/ProductsPage.jsx'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage.jsx'));
const HelloPage = lazy(() => import('./pages/HelloPage.jsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const CartPage = lazy(() => import('./pages/CartPage.jsx'));
const OrderPage = lazy(() => import('./pages/OrderPage.jsx'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage.jsx'));
const UserOrdersPage = lazy(() => import('./pages/UserOrdersPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage.jsx'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage.jsx'));
const EmailConfirmationPage = lazy(() => import('./pages/EmailConfirmationPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const FaqPage = lazy(() => import('./pages/FaqPage.jsx'));
const ShippingPage = lazy(() => import('./pages/ShippingPage.jsx'));
const PacksPage = lazy(() => import('./pages/PacksPage.jsx'));
const PackDetailPage = lazy(() => import('./pages/PackDetailPage.jsx'));
const CustomPacksPage = lazy(() => import('./pages/CustomPacksPage'));
const CustomPackCreationPage = lazy(() => import('./pages/CustomPackCreationPage'));
const PublicLandingPage = lazy(() => import('./pages/PublicLandingPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

// LAZY LOAD ADMIN COMPONENTS (Code Splitting)
const AdminLayout = lazy(() => import('./components/AdminLayout.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage.jsx'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm.jsx'));
const AdminProductCommentsPage = lazy(() => import('./pages/admin/AdminProductCommentsPage.jsx'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage.jsx'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage.jsx'));
const AdminReviewsPage = lazy(() => import('./pages/admin/AdminReviewsPage.jsx'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage.jsx'));
const AdminCategoryForm = lazy(() => import('./pages/admin/AdminCategoryForm.jsx'));
const AdminHeroPage = lazy(() => import('./pages/admin/AdminHeroPage.jsx'));
const AdminPacksPage = lazy(() => import('./pages/admin/AdminPacksPage.jsx'));
const AdminPackForm = lazy(() => import('./pages/admin/AdminPackForm.jsx'));
const AdminPackEditPage = lazy(() => import('./pages/admin/AdminPackEditPage.jsx'));
const AdminPackCommentsPage = lazy(() => import('./pages/admin/AdminPackCommentsPage.jsx'));
const AdminPackRecommendationsPage = lazy(() => import('./pages/admin/AdminPackRecommendationsPage.jsx'));
const AdminCustomPacksPage = lazy(() => import('./pages/admin/AdminCustomPacksPage'));
const AdminCustomPackForm = lazy(() => import('./pages/admin/AdminCustomPackForm'));
const AdminCouponsPage = lazy(() => import('./pages/admin/AdminCouponsPage.jsx'));
const AdminAnnouncementPage = lazy(() => import('./pages/admin/AdminAnnouncementPage.jsx'));
const AdminCountdownPage = lazy(() => import('./pages/admin/AdminCountdownPage.jsx'));
const EnhancedVisitorCounterSettingsPage = lazy(() => import('./pages/admin/EnhancedVisitorCounterSettingsPage.jsx'));
const ReviewFormSettingsPage = lazy(() => import('./pages/admin/ReviewFormSettingsPage.jsx'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage.jsx'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage.jsx'));
const AdminBrandSettingsPage = lazy(() => import('./pages/admin/AdminBrandSettingsPage.jsx'));
const AdminIntegrationsPage = lazy(() => import('./pages/admin/AdminIntegrationsPage.jsx'));
const AdminRolesPage = lazy(() => import('./pages/admin/AdminRolesPage.jsx'));
const AdminPermissionsPage = lazy(() => import('./pages/admin/AdminPermissionsPage.jsx'));
const AdminLandingPagesPage = lazy(() => import('./pages/admin/AdminLandingPagesPage.jsx'));
const AdminLandingPageBuilder = lazy(() => import('./pages/admin/AdminLandingPageBuilder.jsx'));

import { getCart, getUserProfile, getMyActiveRewards } from './api/apiService.js';
import RewardPopup from './components/RewardPopup.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FacebookPixel from './components/FacebookPixel.jsx';
import GoogleAnalytics from './components/GoogleAnalytics.jsx';
import AnalyticsTracker from './components/AnalyticsTracker.jsx';
import AnnouncementBar from './components/AnnouncementBar.jsx';
import StickyCartButton from './components/landingPage/StickyCartButton.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

// Global Effects
const ClickAnnouncer = lazy(() => import('./components/ClickAnnouncer.jsx'));

// Loading component for suspense fallback
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
        </div>
    </div>
);

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [activeCoupons, setActiveCoupons] = useState([]);

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

    const fetchActiveCoupons = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await getMyActiveRewards();
                console.log("Active coupons response:", response.data);
                const coupons = response.data || [];
                setActiveCoupons(coupons);
            } catch (error) {
                console.error("Failed to fetch active coupons:", error);
            }
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
        checkAuthAndFetchRole();
        fetchCartCount();
        fetchActiveCoupons();

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
        <LanguageProvider>
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
                        <RewardPopup coupons={activeCoupons} />
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
                            <Suspense fallback={<PageLoader />}>
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

                                    {/* Admin-Only Routes - Wrapped in Suspense for code splitting */}
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
                                        <Route path="settings" element={<AdminSettingsPage />} />
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
                            </Suspense>
                        </main>
                        <Footer />

                        {/* Floating Action Button - Disabled for minimal design */}
                        {/* <FloatingActionButton cartCount={cartCount} /> */}

                        {/* Sticky Cart Button - Replaces FloatingActionButton */}
                        <StickyCartButton cartCount={cartCount} />

                        {/* Global Click Effects */}
                        <Suspense fallback={null}>
                            <ClickAnnouncer />
                        </Suspense>
                    </div >
                </SiteSettingsProvider >
            </BrowserRouter >
        </LanguageProvider >
    );
}

export default App;
