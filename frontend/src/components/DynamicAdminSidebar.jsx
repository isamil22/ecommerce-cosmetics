import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiBox, FiTag, FiShoppingBag, FiUsers, FiStar, FiPercent, FiSettings, FiBarChart2, FiHome, FiPackage, FiTarget, FiDollarSign, FiEye, FiBell, FiMessageSquare, FiChevronRight, FiActivity, FiShield, FiKey } from 'react-icons/fi';
import { usePermissions } from '../contexts/PermissionContext';
import PermissionGuard from './PermissionGuard';

const DynamicAdminSidebar = () => {
    const activeLinkClass = "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg transform scale-105";
    const inactiveLinkClass = "text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 hover:transform hover:translate-x-2";
    const { hasRole, hasPermission } = usePermissions();

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
                        <h2 className="text-xl font-bold group-hover:text-pink-300 transition-colors duration-300">Admin Panel</h2>
                        <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Store Management</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
                {/* Dashboard - Always visible for admins */}
                <PermissionGuard role="ADMIN" anyPermissions={['DASHBOARD:VIEW']}>
                    <NavLink to="/admin/dashboard" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-300 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                        <FiHome className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium">Dashboard</span>
                        <FiChevronRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </NavLink>
                </PermissionGuard>

                {/* Products Section */}
                <PermissionGuard anyPermissions={['PRODUCT:VIEW', 'PRODUCT:CREATE', 'PRODUCT:EDIT', 'CATEGORY:VIEW']}>
                    <div className="pt-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3 px-4 hover:text-pink-400 transition-colors duration-300">Products</p>
                        
                        <ProtectedNavLink 
                            to="/admin/products" 
                            icon={FiBox} 
                            label="Products" 
                            anyPermissions={['PRODUCT:VIEW', 'PRODUCT:CREATE', 'PRODUCT:EDIT']}
                        />
                        
                        <ProtectedNavLink 
                            to="/admin/categories" 
                            icon={FiTag} 
                            label="Categories" 
                            anyPermissions={['CATEGORY:VIEW', 'CATEGORY:CREATE', 'CATEGORY:EDIT']}
                        />
                    </div>
                </PermissionGuard>

                {/* Packs Section */}
                <PermissionGuard anyPermissions={['PACK:VIEW', 'PACK:CREATE', 'CUSTOM_PACK:VIEW']}>
                    <div className="pt-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3 px-4 hover:text-pink-400 transition-colors duration-300">Packs</p>
                        
                        <ProtectedNavLink 
                            to="/admin/packs" 
                            icon={FiPackage} 
                            label="Packs" 
                            anyPermissions={['PACK:VIEW', 'PACK:CREATE', 'PACK:EDIT']}
                        />
                        
                        <ProtectedNavLink 
                            to="/admin/custom-packs" 
                            icon={FiTarget} 
                            label="Custom Packs" 
                            anyPermissions={['CUSTOM_PACK:VIEW', 'CUSTOM_PACK:CREATE', 'CUSTOM_PACK:EDIT']}
                        />
                    </div>
                </PermissionGuard>

                {/* Sales & Orders */}
                <PermissionGuard anyPermissions={['ORDER:VIEW', 'ORDER:MANAGE', 'COUPON:VIEW']}>
                    <div className="pt-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3 px-4 hover:text-pink-400 transition-colors duration-300">Sales</p>
                        
                        <ProtectedNavLink 
                            to="/admin/orders" 
                            icon={FiShoppingBag} 
                            label="Orders" 
                            anyPermissions={['ORDER:VIEW', 'ORDER:MANAGE']}
                        />
                        
                        <ProtectedNavLink 
                            to="/admin/coupons" 
                            icon={FiDollarSign} 
                            label="Coupons" 
                            anyPermissions={['COUPON:VIEW', 'COUPON:CREATE', 'COUPON:EDIT']}
                        />
                    </div>
                </PermissionGuard>

                {/* Users & Reviews */}
                <PermissionGuard anyPermissions={['USER:VIEW', 'REVIEW:VIEW']}>
                    <div className="pt-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3 px-4 hover:text-pink-400 transition-colors duration-300">Users</p>
                        
                        <ProtectedNavLink 
                            to="/admin/users" 
                            icon={FiUsers} 
                            label="Users" 
                            anyPermissions={['USER:VIEW', 'USER:EDIT']}
                        />
                        
                        <ProtectedNavLink 
                            to="/admin/reviews" 
                            icon={FiStar} 
                            label="Reviews" 
                            anyPermissions={['REVIEW:VIEW', 'REVIEW:APPROVE']}
                        />
                    </div>
                </PermissionGuard>

                {/* Content Management */}
                <PermissionGuard anyPermissions={['HERO:VIEW', 'ANNOUNCEMENT:VIEW', 'ANALYTICS:VIEW']}>
                    <div className="pt-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3 px-4 hover:text-pink-400 transition-colors duration-300">Content</p>
                        
                        <ProtectedNavLink 
                            to="/admin/hero" 
                            icon={FiEye} 
                            label="Hero Section" 
                            anyPermissions={['HERO:VIEW', 'HERO:EDIT']}
                        />
                        
                        <ProtectedNavLink 
                            to="/admin/announcement" 
                            icon={FiBell} 
                            label="Announcements" 
                            anyPermissions={['ANNOUNCEMENT:VIEW', 'ANNOUNCEMENT:EDIT']}
                        />
                        
                        <ProtectedNavLink 
                            to="/admin/countdown" 
                            icon={FiBarChart2} 
                            label="Countdown" 
                            role="ADMIN"
                        />
                        
                        <ProtectedNavLink 
                            to="/admin/enhanced-visitor-counter" 
                            icon={FiUsers} 
                            label="Enhanced Counter" 
                            role="ADMIN"
                        />
                        
                        <ProtectedNavLink 
                            to="/admin/review-form-settings" 
                            icon={FiMessageSquare} 
                            label="Review Form Settings" 
                            anyPermissions={['SETTINGS:VIEW', 'SETTINGS:EDIT']}
                        />
                        
                        <ProtectedNavLink 
                            to="/admin/analytics" 
                            icon={FiBarChart2} 
                            label="Analytics" 
                            anyPermissions={['ANALYTICS:VIEW']}
                        />
                    </div>
                </PermissionGuard>

                {/* RBAC Section - Only for Admins or users with role management permissions */}
                <PermissionGuard anyPermissions={['ROLE:VIEW', 'PERMISSION:VIEW', 'ROLE:CREATE', 'PERMISSION:CREATE']}>
                    <div className="pt-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3 px-4 hover:text-pink-400 transition-colors duration-300 flex items-center">
                            <FiShield className="w-3 h-3 mr-1" />
                            Access Control
                        </p>
                        
                        <ProtectedNavLink 
                            to="/admin/roles" 
                            icon={FiShield} 
                            label="Roles" 
                            anyPermissions={['ROLE:VIEW', 'ROLE:CREATE', 'ROLE:EDIT']}
                        />
                        
                        <ProtectedNavLink 
                            to="/admin/permissions" 
                            icon={FiKey} 
                            label="Permissions" 
                            anyPermissions={['PERMISSION:VIEW', 'PERMISSION:CREATE', 'PERMISSION:EDIT']}
                        />
                    </div>
                </PermissionGuard>

                {/* Settings */}
                <PermissionGuard anyPermissions={['SETTINGS:VIEW', 'SETTINGS:EDIT']}>
                    <div className="pt-4 border-t border-gray-700">
                        <NavLink to="/admin/settings" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-300 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                            <FiSettings className="w-5 h-5 mr-3 group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
                            <span className="font-medium">Settings</span>
                            <FiChevronRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </NavLink>
                    </div>
                </PermissionGuard>
            </nav>
        </div>
    );
};

export default DynamicAdminSidebar;

