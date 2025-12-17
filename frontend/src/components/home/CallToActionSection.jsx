import React from 'react';
import { Link } from 'react-router-dom';
import PurchaseNotifications from '../PurchaseNotifications';

const CallToActionSection = ({ bestsellers }) => {
    // Get product image for notification if available
    const productImage = bestsellers && bestsellers.length > 0 && bestsellers[0].images && bestsellers[0].images.length > 0
        ? bestsellers[0].images[0]
        : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";

    return (
        <section className="relative w-full py-24 lg:py-32 overflow-hidden bg-white">
            {/* Creative Background - Soft Colorful Mesh */}
            <div className="absolute inset-0 bg-slate-50">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-pink-200/40 to-purple-200/40 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-blue-200/40 to-cyan-200/40 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">

                {/* Content Container */}
                <div className="max-w-5xl mx-auto relative">

                    {/* Badge */}
                    <div className="flex justify-center mb-8">
                        <span className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-gradient-to-r from-gray-900 to-slate-800 text-white text-sm font-semibold tracking-wider uppercase animate-fade-in-down shadow-xl shadow-purple-900/10">
                            <span className="text-yellow-400 animate-pulse">✨</span>
                            <span>العرض ينتهي قريباً / L'offre se termine bientôt</span>
                        </span>
                    </div>

                    {/* Main Heading with Creative Gradient */}
                    <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                        ابدأ التسوق الآن
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 drop-shadow-sm">
                            واستمتع بالعروض!
                        </span>
                    </h2>

                    {/* Sub Heading */}
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
                        Commencez vos achats maintenant et profitez d'offres exceptionnelles !
                    </h3>

                    {/* Description */}
                    <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                        اكتشف آلاف المنتجات الأصلية بأفضل الأسعار مع شحن مجاني وضمان الجودة
                        <br />
                        <span className="text-base opacity-80 mt-2 block font-normal text-slate-500">
                            Découvrez des milliers de produits authentiques aux meilleurs prix avec livraison gratuite et garantie de qualité
                        </span>
                    </p>

                    {/* Buttons - Creative & Modern */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <Link
                            to="/products"
                            className="group relative bg-gray-900 text-white font-bold py-5 px-12 rounded-full overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 flex items-center gap-3 text-lg min-w-[220px] justify-center"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <span className="text-2xl group-hover:rotate-12 transition-transform">🛍️</span>
                                <span>تسوق الآن / Acheter</span>
                            </span>
                            {/* Button Hover Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>

                        <Link
                            to="/packs"
                            className="group relative bg-white text-gray-900 border-2 border-gray-100 font-bold py-5 px-12 rounded-full hover:border-transparent transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center gap-3 text-lg min-w-[220px] justify-center overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <span className="text-2xl group-hover:scale-110 transition-transform">🎁</span>
                                <span>الباقات / Packs</span>
                            </span>
                            {/* Button Hover Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                        </Link>
                    </div>
                </div>

                {/* Purchase Notifications Component */}
                <PurchaseNotifications
                    packName="منتجات المتجر / Produits du Magasin"
                    productImage={productImage}
                />
            </div>
        </section>
    );
};

export default CallToActionSection;
