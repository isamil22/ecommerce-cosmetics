// frontend/src/components/Footer.jsx - ENHANCED PROFESSIONAL VERSION
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);

    // Handler for the newsletter form submission
    const handleNewsletterSubmit = async (event) => {
        event.preventDefault();

        if (!email || !email.includes('@')) {
            toast.error('الرجاء إدخال بريد إلكتروني صحيح / Please enter a valid email');
            return;
        }

        setIsSubscribing(true);

        // Simulate API call
        setTimeout(() => {
            toast.success(`🎉 شكراً للاشتراك! / Thank you for subscribing!`);
            setEmail('');
            setIsSubscribing(false);
        }, 1000);
    };

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-8">
            {/* Trust Badges Section */}
            <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 py-8">
                <div className="container-xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
                        <div className="flex flex-col items-center space-y-2">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <p className="font-bold">منتجات أصلية<br />100% Authentic</p>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="font-bold">ضمان الجودة<br />Quality Guaranteed</p>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="font-bold">شحن مجاني<br />Free Shipping</p>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            <p className="font-bold">إرجاع سهل<br />Easy Returns</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="container-xl section-spacing-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* About Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">BC</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                    BeautyCosmetics
                                </h3>
                                <p className="text-xs text-gray-400">متجر التجميل / Beauty Store</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            متجرك الأول للحصول على أفضل منتجات التجميل. نؤمن بالجودة والشفافية وإظهار إشراقتك الداخلية.<br /><br />
                            Your one-stop shop for the best in beauty. We believe in quality, transparency, and bringing out your inner radiance.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a href="mailto:support@beautycosmetics.com" className="hover:text-pink-400 transition-colors">
                                    support@beautycosmetics.com
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <a href="tel:+1234567890" className="hover:text-pink-400 transition-colors">
                                    +1 (234) 567-890
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="text-pink-500">🛍️</span>
                            <span>تسوق / Shop</span>
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/products" className="hover:text-pink-400 transition-colors flex items-center gap-2">
                                <span>→</span><span>جميع المنتجات / All Products</span>
                            </Link></li>
                            <li><Link to="/products?specialFilter=newArrival" className="hover:text-pink-400 transition-colors flex items-center gap-2">
                                <span>→</span><span>وصل حديثاً / New Arrivals</span>
                            </Link></li>
                            <li><Link to="/products?specialFilter=bestseller" className="hover:text-pink-400 transition-colors flex items-center gap-2">
                                <span>→</span><span>الأكثر مبيعاً / Bestsellers</span>
                            </Link></li>
                            <li><Link to="/packs" className="hover:text-pink-400 transition-colors flex items-center gap-2">
                                <span>→</span><span>الباقات / Packs</span>
                            </Link></li>
                            <li><Link to="/custom-packs" className="hover:text-pink-400 transition-colors flex items-center gap-2">
                                <span>→</span><span>باقات مخصصة / Custom Packs</span>
                            </Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="text-blue-500">💬</span>
                            <span>الدعم / Support</span>
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/contact" className="hover:text-pink-400 transition-colors flex items-center gap-2">
                                <span>→</span><span>اتصل بنا / Contact Us</span>
                            </Link></li>
                            <li><Link to="/faq" className="hover:text-pink-400 transition-colors flex items-center gap-2">
                                <span>→</span><span>الأسئلة الشائعة / FAQs</span>
                            </Link></li>
                            <li><Link to="/shipping" className="hover:text-pink-400 transition-colors flex items-center gap-2">
                                <span>→</span><span>الشحن والإرجاع / Shipping</span>
                            </Link></li>
                            <li><Link to="/profile" className="hover:text-pink-400 transition-colors flex items-center gap-2">
                                <span>→</span><span>حسابي / My Account</span>
                            </Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="text-purple-500">✉️</span>
                            <span>النشرة / Newsletter</span>
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                            اشترك للحصول على آخر العروض<br />
                            Subscribe for latest deals
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="بريدك الإلكتروني / Your email"
                                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-pink-500 transition-colors"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSubscribing}
                                className={`w-full font-bold py-3 rounded-lg transition-all duration-200 ${isSubscribing
                                        ? 'bg-gray-700 text-gray-400 cursor-wait'
                                        : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transform hover:scale-105'
                                    }`}
                            >
                                {isSubscribing ? '...جارٍ الاشتراك' : 'اشترك / Subscribe'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-12 pt-8 border-t border-gray-700">
                    <h4 className="text-center text-sm text-gray-400 mb-4">طرق الدفع المقبولة / Accepted Payment Methods</h4>
                    <div className="flex justify-center items-center flex-wrap gap-4">
                        <div className="bg-white px-4 py-2 rounded shadow">
                            <span className="text-blue-600 font-bold">VISA</span>
                        </div>
                        <div className="bg-white px-4 py-2 rounded shadow">
                            <span className="text-orange-600 font-bold">Mastercard</span>
                        </div>
                        <div className="bg-white px-4 py-2 rounded shadow">
                            <span className="text-blue-500 font-bold">PayPal</span>
                        </div>
                        <div className="bg-white px-4 py-2 rounded shadow">
                            <span className="text-gray-700 font-bold">Apple Pay</span>
                        </div>
                        <div className="bg-white px-4 py-2 rounded shadow">
                            <span className="text-gray-700 font-bold">Cash</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-sm text-gray-400 text-center md:text-left">
                            &copy; {new Date().getFullYear()} BeautyCosmetics. جميع الحقوق محفوظة / All rights reserved.
                        </p>

                        {/* Social Media */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">تابعنا / Follow Us:</span>
                            <div className="flex gap-3">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-200 transform hover:scale-110">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-200 transform hover:scale-110">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-white transition-all duration-200 transform hover:scale-110">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </a>
                                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all duration-200 transform hover:scale-110">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <Link to="/privacy" className="hover:text-pink-400 transition-colors">سياسة الخصوصية / Privacy</Link>
                            <span>|</span>
                            <Link to="/terms" className="hover:text-pink-400 transition-colors">الشروط / Terms</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Top Button */}
            <div className="text-center py-6 bg-gray-900">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors group"
                >
                    <svg className="w-5 h-5 transform group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span className="font-semibold">العودة للأعلى / Back to Top</span>
                </button>
            </div>
        </footer>
    );
};

export default Footer;