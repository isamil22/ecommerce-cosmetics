import React from 'react';

const ShippingPage = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <div className="inline-block mb-4">
                    <span className="text-5xl">🚚</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">الشحن والاسترجاع / Livraison et Retours</h1>
                <p className="text-gray-600 text-lg">
                    معلومات عن التوصيل وسياسة الإرجاع / Informations sur la livraison et la politique de retour
                </p>
            </div>

            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="prose max-w-none space-y-8">
                    {/* Shipping Section */}
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h2 className="text-2xl font-bold text-blue-900 flex items-center mb-4">
                            <span className="ml-2 text-3xl">📦</span>
                            سياسة الشحن / Politique de Livraison
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            نقوم بالتوصيل إلى جميع المدن المغربية. نلتزم بتوصيل طلبك في أسرع وقت ممكن.
                            <br />
                            Nous livrons dans toutes les villes du Maroc. Nous nous engageons à vous livrer votre commande le plus rapidement possible.
                        </p>

                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                            <h3 className="font-semibold text-blue-800 mb-3">مواعيد التوصيل / Délais de livraison :</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>
                                    <strong>الدار البيضاء، الرباط، مراكش، طنجة:</strong> 1-3 أيام عمل
                                    <br />
                                    <span className="text-sm text-gray-500">Casablanca, Rabat, Marrakech, Tanger : 1-3 jours ouvrables</span>
                                </li>
                                <li>
                                    <strong>باقي المدن:</strong> 2-5 أيام عمل
                                    <br />
                                    <span className="text-sm text-gray-500">Autres villes : 2-5 jours ouvrables</span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-4 flex items-center text-blue-800 font-medium">
                            <span className="text-xl ml-2">💵</span>
                            <p>الدفع عند الاستلام متوفر لجميع الطلبات / Le paiement à la livraison est disponible pour toutes les commandes</p>
                        </div>
                    </div>

                    {/* Returns Section */}
                    <div className="bg-pink-50 p-6 rounded-xl border border-pink-100">
                        <h2 className="text-2xl font-bold text-pink-900 flex items-center mb-4">
                            <span className="ml-2 text-3xl">↩️</span>
                            سياسة الاسترجاع / Politique de Retour
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            رضاكم هو أولويتنا. إذا لم تكن راضياً تماماً عن مشترياتك، يمكنك إرجاع أي منتجات غير مفتوحة خلال 30 يوماً من تاريخ الشراء.
                            <br />
                            Votre satisfaction est notre priorité. Si vous n'êtes pas entièrement satisfait de votre achat, vous pouvez retourner tout article non ouvert dans les 30 jours suivant la date d'achat.
                        </p>

                        <div className="bg-white p-4 rounded-lg border border-pink-200 shadow-sm space-y-3">
                            <div className="flex items-start">
                                <span className="text-pink-500 ml-2 mt-1">✓</span>
                                <p className="text-sm text-gray-600">
                                    يجب أن تكون المنتجات في حالتها الأصلية وغير مستخدمة.
                                    <br />
                                    Les articles doivent être dans leur état d'origine et inutilisés.
                                </p>
                            </div>
                            <div className="flex items-start">
                                <span className="text-pink-500 ml-2 mt-1">✓</span>
                                <p className="text-sm text-gray-600">
                                    تكاليف الشحن للإرجاع تقع على عاتق الزبون إلا في حالة وجود عيب في المنتج.
                                    <br />
                                    Les frais de retour sont à la charge du client, sauf en cas de produit défectueux.
                                </p>
                            </div>
                        </div>

                        <p className="mt-4 text-gray-700">
                            للبدء في عملية الإرجاع، يرجى التواصل مع خدمة العملاء عبر صفحة "اتصل بنا".
                            <br />
                            Pour initier un retour, veuillez contacter notre service client via la page "Contactez-nous".
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPage;