import React from 'react';
import TrustBadges from '../TrustBadges'; // Adjusted import assuming this file is in components/home, need to go up one level if in components/home. 
// Wait, if I put this in src/components/home/WhyChooseUsSection.jsx, and TrustBadges is in src/components/TrustBadges.jsx:
// Path should be '../TrustBadges' if TrustBadges is in 'src/components' and this is in 'src/components/home' -> No, '../' goes to 'src/components'. Correct.

const WhyChooseUsSection = () => {
    return (
        <section className="relative w-full py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-300/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-300/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-16 relative">
                    <div className="inline-block mb-4">
                        <span className="text-6xl animate-bounce inline-block">💎</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight drop-shadow-sm">
                        لماذا تختار متجرنا؟
                    </h2>
                    <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600 mb-6">
                        Why Choose Our Store?
                    </h3>
                    <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full"></div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">

                    {/* Card 1: Authentic Products */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="relative h-full bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl transition-all duration-500 transform group-hover:-translate-y-4 group-hover:shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-bl-full z-0 opacity-50"></div>

                            <div className="relative z-10 flex flex-col items-center text-center h-full">
                                <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                    <span className="text-5xl">🎯</span>
                                </div>
                                <h4 className="text-2xl font-black text-gray-800 mb-3">
                                    منتجات أصلية مضمونة
                                </h4>
                                <h5 className="text-xl font-bold text-pink-600 mb-4">
                                    100% Produits Authentiques
                                </h5>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    جميع منتجاتنا أصلية ومضمونة من العلامات التجارية الموثوقة
                                    <br />
                                    <span className="text-sm text-gray-500 mt-2 block">
                                        Tous nos produits sont authentiques et garantis par des marques de confiance
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Fast Shipping */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="relative h-full bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl transition-all duration-500 transform group-hover:-translate-y-4 group-hover:shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-bl-full z-0 opacity-50"></div>

                            <div className="relative z-10 flex flex-col items-center text-center h-full">
                                <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                    <span className="text-5xl">🚚</span>
                                </div>
                                <h4 className="text-2xl font-black text-gray-800 mb-3">
                                    توصيل سريع ومجاني
                                </h4>
                                <h5 className="text-xl font-bold text-orange-600 mb-4">
                                    Livraison Rapide et Gratuite
                                </h5>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    شحن مجاني لجميع الطلبات والتوصيل خلال 3-5 أيام
                                    <br />
                                    <span className="text-sm text-gray-500 mt-2 block">
                                        Livraison gratuite sur toutes les commandes avec livraison en 3-5 jours
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Premium Support */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="relative h-full bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl transition-all duration-500 transform group-hover:-translate-y-4 group-hover:shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-bl-full z-0 opacity-50"></div>

                            <div className="relative z-10 flex flex-col items-center text-center h-full">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                    <span className="text-5xl">💎</span>
                                </div>
                                <h4 className="text-2xl font-black text-gray-800 mb-3">
                                    خدمة عملاء متميزة
                                </h4>
                                <h5 className="text-xl font-bold text-blue-600 mb-4">
                                    Service Client Premium
                                </h5>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    فريق دعم متاح 24/7 لمساعدتك في أي استفسار
                                    <br />
                                    <span className="text-sm text-gray-500 mt-2 block">
                                        Équipe d'assistance disponible 24/7 pour répondre à toutes vos questions
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Badges Integration */}
                <div className="mt-20 transform hover:scale-[1.02] transition-transform duration-500">
                    <TrustBadges />
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUsSection;
