// frontend/src/components/Navbar.jsx - ENHANCED PROFESSIONAL VERSION
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/apiService';

const Navbar = ({ isAuthenticated, setIsAuthenticated, userRole, cartCount }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logoutUser();
        setIsAuthenticated(false);
        setShowUserMenu(false);
        navigate('/auth');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setShowSearch(false);
        }
    };

    const CartIcon = ({ count }) => (
        <Link
            to="/cart"
            className="relative flex items-center p-2 text-gray-700 hover:text-pink-600 focus:outline-none transition-all duration-200 group"
            aria-label={`سلة التسوق ${count} عناصر / Shopping cart with ${count} items`}
        >
            <svg className="h-7 w-7 transform group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {count > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-lg animate-pulse">
                    {count}
                </span>
            )}
        </Link>
    );

    return (
        <>

            {/* Main Navbar */}
            <nav className={`bg-white sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-xl' : 'shadow-md'}`}>
            <div className="container-xl">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                    <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center gap-2 group">
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                    <span className="text-white font-bold text-xl">BC</span>
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="text-2xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            BeautyCosmetics
                                    </h1>
                                    <p className="text-xs text-gray-500">متجر التجميل / Beauty Store</p>
                                </div>
                        </Link>
                    </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-6 rtl:space-x-reverse">
                            <Link to="/" className="group flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-pink-600 font-medium transition-all duration-200 relative">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>الرئيسية / Home</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                            </Link>

                            <Link to="/products" className="group flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-pink-600 font-medium transition-all duration-200 relative">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <span>منتجات / Products</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                            </Link>

                            <Link to="/packs" className="group flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-pink-600 font-medium transition-all duration-200 relative">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                                <span>باقات / Packs</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                            </Link>

                            <Link to="/custom-packs" className="group flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-pink-600 font-medium transition-all duration-200 relative">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>باقات مخصصة / Custom</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                            </Link>

                            {userRole === 'ADMIN' && (
                                <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Admin</span>
                            </Link>
                        )}
                        </div>

                        {/* Right Side Icons */}
                        <div className="hidden lg:flex items-center space-x-4 rtl:space-x-reverse">
                            {/* Search Button */}
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className="p-2 text-gray-700 hover:text-pink-600 transition-colors"
                                aria-label="بحث / Search"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* Cart */}
                            <CartIcon count={cartCount} />

                            {/* User Menu */}
                        {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 p-2 text-gray-700 hover:text-pink-600 transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                            U
                                        </div>
                                    </button>

                                    {/* Dropdown */}
                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 border border-gray-100">
                                            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span>حسابي / Profile</span>
                                            </Link>
                                            <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                                <span>طلباتي / My Orders</span>
                                            </Link>
                                            <hr className="my-2" />
                                <button
                                    onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                                >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                <span>تسجيل خروج / Logout</span>
                                </button>
                                        </div>
                                    )}
                    </div>
                            ) : (
                                <Link to="/auth" className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2.5 rounded-full font-bold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg transform hover:scale-105">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    <span>تسجيل دخول / Login</span>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center lg:hidden space-x-2 rtl:space-x-reverse">
                            <CartIcon count={cartCount} />
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 rounded-lg text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                            >
                                {isOpen ? (
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                    </svg>
                            )}
                        </button>
                        </div>
                    </div>
                </div>

                {/* Search Bar (Expandable) */}
                {showSearch && (
                    <div className="border-t border-gray-100 bg-gray-50 px-4 py-4 animate-fade-in">
                        <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="ابحث عن المنتجات... / Search for products..."
                                    className="w-full px-6 py-4 pr-12 rounded-full border-2 border-pink-200 focus:border-pink-500 focus:outline-none text-lg"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </form>
            </div>
                )}

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden border-t border-gray-100 animate-slide-down">
                        <div className="px-4 pt-4 pb-6 space-y-2 bg-gray-50">
                            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors font-medium">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>الرئيسية / Home</span>
                            </Link>

                            <Link to="/products" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors font-medium">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <span>منتجات / Products</span>
                            </Link>

                            <Link to="/packs" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors font-medium">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                                <span>باقات / Packs</span>
                            </Link>

                            <Link to="/custom-packs" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors font-medium">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>باقات مخصصة / Custom</span>
                            </Link>

                    {userRole === 'ADMIN' && (
                                <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-bold">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Admin</span>
                                </Link>
                            )}

                            <hr className="my-4" />

                    {isAuthenticated ? (
                        <>
                                    <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors font-medium">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>حسابي / Profile</span>
                                    </Link>

                            <button
                                        onClick={() => { handleLogout(); setIsOpen(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                            >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span>تسجيل خروج / Logout</span>
                            </button>
                        </>
                    ) : (
                                <Link to="/auth" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    <span>تسجيل دخول / Login</span>
                                </Link>
                    )}
                </div>
            </div>
                )}
        </nav>
        </>
    );
};

export default Navbar;