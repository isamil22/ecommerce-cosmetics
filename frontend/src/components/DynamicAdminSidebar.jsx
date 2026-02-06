import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiBox, FiTag, FiShoppingBag, FiUsers, FiStar, FiPercent, FiSettings, FiBarChart2, FiHome, FiPackage, FiTarget, FiDollarSign, FiEye, FiBell, FiMessageSquare, FiChevronRight, FiActivity, FiShield, FiKey, FiFacebook, FiLayout, FiImage, FiLayers } from 'react-icons/fi';
import { usePermissions } from '../contexts/PermissionContext';
import { useLanguage } from '../contexts/LanguageContext';
import PermissionGuard from './PermissionGuard';

const DynamicAdminSidebar = () => {
    const activeLinkClass = "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg transform scale-105";
    const inactiveLinkClass = "text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 hover:transform hover:translate-x-2";
    const { hasRole, hasPermission } = usePermissions();
    const { t } = useLanguage();

    // Helper function to render NavLink with permission guard
    const ProtectedNavLink = ({ to, icon: Icon, label, permission, anyPermissions, role }) => (
        <PermissionGuard permission={permission} anyPermissions={anyPermissions} role={role}>
            <NavLink to={to} className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-300 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                <Icon className="w-5 h-5 mr-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">{label}</span>
                <FiChevronRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </NavLink>
        </PermissionGuard>
    );

    return (
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 min-h-screen shadow-2xl">
            {/* Enhanced Header with Animations */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3 group">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 relative">
                        <FiGrid className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse">
                            <FiActivity className="w-2 h-2 text-white" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold group-hover:text-pink-300 transition-colors duration-300">{t('adminSidebar.adminPanel')}</h2>
                        <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{t('adminSidebar.storeManagement')}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
                {/* Dashboard - Always visible for admins */}
                <PermissionGuard role="ADMIN" anyPermissions={['DASHBOARD:VIEW']}>
                    <NavLink to="/admin/dashboard" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-300 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                        <FiHome className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium">{t('adminSidebar.dashboard')}</span>
                        <FiChevronRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </NavLink>
                </PermissionGuard>

                {/* Products Section */}
                <PermissionGuard anyPermissions={['PRODUCT:VIEW', 'PRODUCT:CREATE', 'PRODUCT:EDIT', 'CATEGORY:VIEW']}>
                    <div className="pt-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3 px-4 hover:text-pink-400 transition-colors duration-300">{t('adminSidebar.products')}</p>

                        <ProtectedNavLink
                            to="/admin/products"
                            icon={FiBox}
                            label={t('adminSidebar.products')}
                            anyPermissions={['PRODUCT:VIEW', 'PRODUCT:CREATE', 'PRODUCT:EDIT']}
                        />

                        <ProtectedNavLink
                            to="/admin/categories"
                            icon={FiTag}
                            label={t('adminSidebar.categories')}
                            anyPermissions={['CATEGORY:VIEW', 'CATEGORY:CREATE', 'CATEGORY:EDIT']}
                        />
                    </div>
                </PermissionGuard>

                {/* Packs Section */}
                <PermissionGuard anyPermissions={['PACK:VIEW', 'PACK:CREATE', 'CUSTOM_PACK:VIEW']}>
                    <div className="pt-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3 px-4 hover:text-pink-400 transition-colors duration-300">{t('adminSidebar.packs')}</p>

                        <ProtectedNavLink
                            to="/admin/packs"
                            icon={FiPackage}
                            label={t('adminSidebar.packs')}
                            anyPermissions={['PACK:VIEW', 'PACK:CREATE', 'PACK:EDIT']}
                        />

                        <ProtectedNavLink
                            to="/admin/custom-packs"
                            icon={FiTarget}
                            label={t('adminSidebar.customPacks')}
                            anyPermissions={['CUSTOM_PACK:VIEW', 'CUSTOM_PACK:CREATE', 'CUSTOM_PACK:EDIT']}
                        />
                    </div>
                </PermissionGuard>

                {/* Sales & Orders */}
                <PermissionGuard anyPermissions={['ORDER:VIEW', 'ORDER:MANAGE', 'COUPON:VIEW']}>
                    <div className="pt-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3 px-4 hover:text-pink-400 transition-colors duration-300">{t('adminSidebar.sales')}</p>

                        <ProtectedNavLink
                            to="/admin/orders"
                            icon={FiShoppingBag}
                            label={t('adminSidebar.orders')}
                            anyPermissions={['ORDER:VIEW', 'ORDER:MANAGE']}
                        />

                        <ProtectedNavLink
                            to="/admin/coupons"
                            icon={FiDollarSign}
                            label={t('adminSidebar.coupons')}
                            anyPermissions={['COUPON:VIEW', 'COUPON:CREATE', 'COUPON:EDIT']}
                        />
                        <ProtectedNavLink
                            to="/admin/settings"
                            icon={FiPercent}
                            label={t('adminSidebar.discountRules')}
                            role="ADMIN"
                        />
                    </div>
                </PermissionGuard>

                {/* Users & Reviews */}
                <PermissionGuard anyPermissions={['USER:VIEW', 'REVIEW:VIEW']}>
                    <div className="pt-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3 px-4 hover:text-pink-400 transition-colors duration-300">{t('adminSidebar.users')}</p>

                        <ProtectedNavLink
                            to="/admin/users"
                            icon={FiUsers}
                            label={t('adminSidebar.users')}
                            anyPermissions={['USER:VIEW', 'USER:EDIT']}
                        />

                        <ProtectedNavLink
                            to="/admin/reviews"
                            icon={FiStar}
                            label={t('adminSidebar.reviews')}
                            anyPermissions={['REVIEW:VIEW', 'REVIEW:APPROVE']}
                        />
                    </div>
                </PermissionGuard>

                {/* Content Management */}
                <PermissionGuard anyPermissions={['HERO:VIEW', 'ANNOUNCEMENT:VIEW', 'ANALYTICS:VIEW']}>
                    <div className="pt-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3 px-4 hover:text-pink-400 transition-colors duration-300">{t('adminSidebar.content')}</p>

                        <ProtectedNavLink
                            to="/admin/hero"
                            icon={FiEye}
                            label={t('adminSidebar.heroSection')}
                            anyPermissions={['HERO:VIEW', 'HERO:EDIT']}
                        />

                        <ProtectedNavLink
                            to="/admin/announcement"
                            icon={FiBell}
                            label={t('adminSidebar.announcements')}
                            anyPermissions={['ANNOUNCEMENT:VIEW', 'ANNOUNCEMENT:EDIT']}
                        />

                        <ProtectedNavLink
                            to="/admin/landing-pages"
                            icon={FiLayout}
                            label={t('adminSidebar.landingPages')}
                            anyPermissions={['LANDING_PAGE:VIEW', 'LANDING_PAGE:CREATE', 'LANDING_PAGE:EDIT']}
                        />

                        <ProtectedNavLink
                            to="/admin/countdown"
                            icon={FiBarChart2}
                            label={t('adminSidebar.countdown')}
                            role="ADMIN"
                        />

                        <ProtectedNavLink
                            to="/admin/enhanced-visitor-counter"
                            icon={FiUsers}
                            label={t('adminSidebar.enhancedCounter')}
                            role="ADMIN"
                        />

                        <ProtectedNavLink
                            to="/admin/review-form-settings"
                            icon={FiMessageSquare}
                            label={t('adminSidebar.reviewFormSettings')}
                            anyPermissions={['SETTINGS:VIEW', 'SETTINGS:EDIT']}
                        />

                        <ProtectedNavLink
                            to="/admin/analytics"
                            icon={FiBarChart2}
                            label={t('adminSidebar.analytics')}
                            anyPermissions={['ANALYTICS:VIEW']}
                        />
                    </div>
                </PermissionGuard>

                {/* RBAC Section - Only for Admins or users with role management permissions */}
                <PermissionGuard anyPermissions={['ROLE:VIEW', 'PERMISSION:VIEW', 'ROLE:CREATE', 'PERMISSION:CREATE']}>
                    <div className="pt-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3 px-4 hover:text-pink-400 transition-colors duration-300 flex items-center">
                            <FiShield className="w-3 h-3 mr-1" />
                            {t('adminSidebar.accessControl')}
                        </p>

                        <ProtectedNavLink
                            to="/admin/roles"
                            icon={FiShield}
                            label={t('adminSidebar.roles')}
                            anyPermissions={['ROLE:VIEW', 'ROLE:CREATE', 'ROLE:EDIT']}
                        />

                        <ProtectedNavLink
                            to="/admin/permissions"
                            icon={FiKey}
                            label={t('adminSidebar.permissions')}
                            anyPermissions={['PERMISSION:VIEW', 'PERMISSION:CREATE', 'PERMISSION:EDIT']}
                        />
                    </div>
                </PermissionGuard>

                {/* Facebook Pixel */}
                <PermissionGuard anyPermissions={['SETTINGS:VIEW', 'SETTINGS:EDIT']}>
                    <div className="pt-4 border-t border-gray-700">
                        <NavLink to="/admin/settings/brand" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-300 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                            <FiImage className="w-5 h-5 mr-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="font-medium">{t('adminSidebar.logoSettings')}</span>
                            <FiChevronRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </NavLink>
                        <NavLink to="/admin/settings/integrations" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-300 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                            <FiLayers className="w-5 h-5 mr-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="font-medium">{t('adminSidebar.facebookPixel')}</span>
                            <FiChevronRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </NavLink>
                    </div>
                </PermissionGuard>
            </nav>
        </div>
    );
};

export default DynamicAdminSidebar;

