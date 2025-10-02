import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiBox, FiTag, FiShoppingBag, FiUsers, FiStar, FiPercent, FiSettings, FiBarChart2, FiHome, FiPackage, FiTarget, FiDollarSign, FiEye, FiBell } from 'react-icons/fi';

const AdminSidebar = () => {
    const activeLinkClass = "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg";
    const inactiveLinkClass = "text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200";

    return (
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 min-h-screen shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <FiGrid className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Admin Panel</h2>
                        <p className="text-xs text-gray-400">Store Management</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
                {/* Main Navigation */}
                <NavLink to="/admin/dashboard" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-200 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                    <FiHome className="w-5 h-5 mr-3" />
                    <span className="font-medium">Dashboard</span>
                    {({ isActive }) => isActive && <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>}
                </NavLink>

                {/* Products Section */}
                <div className="pt-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3 px-4">Products</p>
                    <NavLink to="/admin/products" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-200 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                        <FiBox className="w-5 h-5 mr-3" />
                        <span className="font-medium">Products</span>
                    </NavLink>
                    <NavLink to="/admin/categories" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-200 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                        <FiTag className="w-5 h-5 mr-3" />
                        <span className="font-medium">Categories</span>
                    </NavLink>
                </div>

                {/* Packs Section */}
                <div className="pt-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3 px-4">Packs</p>
                    <NavLink to="/admin/packs" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-200 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                        <FiPackage className="w-5 h-5 mr-3" />
                        <span className="font-medium">Packs</span>
                    </NavLink>
                    <NavLink to="/admin/custom-packs" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-200 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                        <FiTarget className="w-5 h-5 mr-3" />
                        <span className="font-medium">Custom Packs</span>
                    </NavLink>
                </div>

                {/* Sales & Orders */}
                <div className="pt-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3 px-4">Sales</p>
                    <NavLink to="/admin/orders" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-200 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                        <FiShoppingBag className="w-5 h-5 mr-3" />
                        <span className="font-medium">Orders</span>
                    </NavLink>
                    <NavLink to="/admin/coupons" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-200 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                        <FiDollarSign className="w-5 h-5 mr-3" />
                        <span className="font-medium">Coupons</span>
                    </NavLink>
                </div>

                {/* Users & Reviews */}
                <div className="pt-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3 px-4">Users</p>
                    <NavLink to="/admin/users" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-200 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                        <FiUsers className="w-5 h-5 mr-3" />
                        <span className="font-medium">Users</span>
                    </NavLink>
                    <NavLink to="/admin/reviews" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-200 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                        <FiStar className="w-5 h-5 mr-3" />
                        <span className="font-medium">Reviews</span>
                    </NavLink>
                </div>

                {/* Content Management */}
                <div className="pt-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3 px-4">Content</p>
                    <NavLink to="/admin/hero" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-200 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                        <FiEye className="w-5 h-5 mr-3" />
                        <span className="font-medium">Hero Section</span>
                    </NavLink>
                    <NavLink to="/admin/announcement" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-200 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                        <FiBell className="w-5 h-5 mr-3" />
                        <span className="font-medium">Announcements</span>
                    </NavLink>
                    <NavLink to="/admin/countdown" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-200 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                        <FiBarChart2 className="w-5 h-5 mr-3" />
                        <span className="font-medium">Countdown</span>
                    </NavLink>
                    <NavLink to="/admin/vistorcountsetting" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-200 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                        <FiUsers className="w-5 h-5 mr-3" />
                        <span className="font-medium">Visitor Counter</span>
                    </NavLink>
                    <NavLink to="/admin/enhanced-visitor-counter" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-200 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                        <FiUsers className="w-5 h-5 mr-3" />
                        <span className="font-medium">Enhanced Counter</span>
                    </NavLink>
                </div>

                {/* Settings */}
                <div className="pt-4 border-t border-gray-700">
                    <NavLink to="/admin/settings" className={({ isActive }) => `flex items-center py-3 px-4 rounded-xl transition-all duration-200 group ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                        <FiSettings className="w-5 h-5 mr-3" />
                        <span className="font-medium">Settings</span>
                    </NavLink>
                </div>
            </nav>
        </div>
    );
};

export default AdminSidebar;