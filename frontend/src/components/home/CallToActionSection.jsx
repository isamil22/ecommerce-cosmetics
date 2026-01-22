import React from 'react';
import { Link } from 'react-router-dom';
import PurchaseNotifications from '../PurchaseNotifications';

const CallToActionSection = ({ bestsellers }) => {
    // Get product image for notification if available
    const productImage = bestsellers && bestsellers.length > 0 && bestsellers[0].images && bestsellers[0].images.length > 0
        ? bestsellers[0].images[0]
        : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";

    return (
        <section className="relative w-full py-8 md:py-24 lg:py-32 overflow-hidden bg-white">
            {/* Creative Background - Soft Colorful Mesh */}
            <div className="absolute inset-0 bg-slate-50">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-pink-200/40 to-purple-200/40 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-blue-200/40 to-cyan-200/40 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">

                {/* Content Container */}
                <div className="max-w-5xl mx-auto relative mt-4 md:mt-0">

                    {/* Badge */}
                    <div className="flex justify-center mb-4 md:mb-8">
                        <span className="inline-flex items-center gap-1.5 md:gap-2 py-1 px-3 md:py-2 md:px-6 rounded-full bg-gradient-to-r from-gray-900 to-slate-800 text-white text-[10px] md:text-sm font-semibold tracking-wider uppercase animate-fade-in-down shadow-xl shadow-purple-900/10">
                            <span className="text-yellow-400 animate-pulse text-xs md:text-base">✨</span>
                            <span>العرض ينتهي قريباً / L'offre se termine bientôt</span>
                        </span>
                    </div>

                    {/* Main Heading with Creative Gradient */}
                    <h2 className="text-2xl sm:text-5xl md:text-7xl font-black text-gray-900 mb-3 md:mb-6 tracking-tight leading-tight">
                        ابدأ التسوق الآن
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 drop-shadow-sm">
                            واستمتع بالعروض!
                        </span>
                    </h2>

                    {/* Sub Heading */}
                    <h3 className="text-sm md:text-3xl font-bold text-gray-600 mb-4 md:mb-8 leading-relaxed max-w-4xl mx-auto px-2">
                        Commencez vos achats maintenant et profitez d'offres exceptionnelles !
                    </h3>

                    {/* Description */}
                    <p className="text-xs md:text-xl text-gray-600 mb-6 md:mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-4">
                        اكتشف آلاف المنتجات الأصلية بأفضل الأسعار مع شحن مجاني وضمان الجودة
                        <br />
                        <span className="text-xs md:text-base opacity-80 mt-1 md:mt-2 block font-normal text-slate-500">
                            Découvrez des milliers de produits authentiques aux meilleurs prix avec livraison gratuite et garantie de qualité
                        </span>
                    </p>

                    {/* Buttons - Creative & Modern */}
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-5 justify-center items-center px-4">
                        <Link
                            to="/products"
                            className="group relative bg-gray-900 text-white font-bold py-3 px-8 md:py-5 md:px-12 rounded-full overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 flex items-center gap-2 md:gap-3 text-sm md:text-lg w-full sm:w-auto min-w-[200px] justify-center"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <span className="text-lg md:text-2xl group-hover:rotate-12 transition-transform">🛍️</span>
                                <span>تسوق الآن / Acheter</span>
                            </span>
                            {/* Button Hover Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>

                        <Link
                            to="/packs"
                            className="group relative bg-white text-gray-900 border-2 border-gray-100 font-bold py-3 px-8 md:py-5 md:px-12 rounded-full hover:border-transparent transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center gap-2 md:gap-3 text-sm md:text-lg w-full sm:w-auto min-w-[200px] justify-center overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <span className="text-lg md:text-2xl group-hover:scale-110 transition-transform">🎁</span>
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
