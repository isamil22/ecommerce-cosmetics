import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import DynamicAdminSidebar from './DynamicAdminSidebar';
import { getUserProfile } from '../api/apiService';
import { PermissionProvider } from '../contexts/PermissionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FiMenu, FiX } from 'react-icons/fi';
import GoogleTranslateWidget from './GoogleTranslateWidget';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCheckingAccess, setIsCheckingAccess] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { t } = useLanguage();

    // Auto-hide sidebar on Landing Page Editor
    useEffect(() => {
        const isLandingPageEditor = location.pathname.match(/\/admin\/landing-pages\/.*\/edit/) || location.pathname.includes('/admin/landing-pages/create');
        if (isLandingPageEditor) {
            setIsSidebarOpen(false);
        } else {
            setIsSidebarOpen(true);
        }
    }, [location.pathname]);

    useEffect(() => {
        const checkDashboardAccess = async () => {
            try {
                const response = await getUserProfile();
                const { hasDashboardAccess, effectiveRole } = response.data;

                // Strict check: Must have dashboard access AND not be a basic 'USER'
                // This prevents normal users from accessing admin area even if one flag is buggy
                if (hasDashboardAccess && effectiveRole !== 'USER') {
                    setHasAccess(true);
                } else {
                    // Redirect to profile page if user doesn't have dashboard access
                    navigate('/profile');
                }
            } catch (error) {
                console.error('Error checking dashboard access:', error);
                // Redirect to login if there's an error (likely not authenticated)
                navigate('/auth');
            } finally {
                setIsCheckingAccess(false);
            }
        };

        checkDashboardAccess();
    }, [navigate]);

    if (isCheckingAccess) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{t('adminLayout.checkingPermissions')}</p>
                </div>
            </div>
        );
    }

    if (!hasAccess) {
        return null; // Will redirect, so don't render anything
    }

    return (
        <PermissionProvider>
            <div className="flex min-h-screen bg-gray-50 relative">

                {/* Manual Toggle Button (Visible only when sidebar is closed) */}
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="fixed top-4 left-4 z-[110] p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-all text-gray-700"
                        title={t('adminLayout.openMenu')}
                    >
                        <FiMenu size={24} />
                    </button>
                )}

                {/* Sidebar Container - Sticky & Fixed Height */}
                <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out relative flex-shrink-0`}>
                    <div className="fixed top-0 bottom-0 left-0 w-64 z-[100] shadow-xl overflow-hidden flex flex-col bg-gray-900"
                        style={{ transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.3s ease-in-out' }}>

                        {/* Close Button (Mobile) */}
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="absolute top-4 right-4 z-[60] text-white/50 hover:text-white transition-colors lg:hidden"
                        >
                            <FiX size={20} />
                        </button>

                        {/* Scrollable Sidebar Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <DynamicAdminSidebar />
                        </div>

                        {/* Collapse Button (Desktop - Always at bottom) */}
                        <div className="p-4 bg-gray-900/90 border-t border-gray-800 flex justify-end">
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors"
                                title={t('adminLayout.collapseMenu')}
                            >
                                <FiX size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 min-h-screen overflow-x-hidden transition-all duration-300" style={{ backgroundColor: '#f8f9fa', padding: '0' }}>
                    <Outlet context={{ isSidebarOpen, setIsSidebarOpen }} />
                </main>

                {/* Emergency Translation Widget - Fixed Bottom Right */}
                <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, background: 'white', padding: '5px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <GoogleTranslateWidget />
                </div>
            </div>
        </PermissionProvider>
    );
};

export default AdminLayout;