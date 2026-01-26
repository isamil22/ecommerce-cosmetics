import React, { useState } from 'react';
import { FiTruck, FiRefreshCw, FiChevronDown, FiShield } from 'react-icons/fi';

const AccordionItem = ({ icon: Icon, title, children, defaultOpen = false, delay }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div
            className="glass-panel-pro rounded-2xl mb-4 overflow-hidden transition-all duration-300 hover:shadow-lg animate-slide-up"
            style={{ animationDelay: delay }}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/40 transition-all duration-200 group"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isOpen ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white transform scale-110' : 'bg-white text-gray-500 group-hover:bg-purple-50 group-hover:text-purple-500'}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <span className={`font-bold text-lg transition-colors duration-200 ${isOpen ? 'text-gray-900' : 'text-gray-700 group-hover:text-purple-600'}`}>{title}</span>
                </div>
                <div className={`transform transition-transform duration-300 text-gray-400 bg-white/50 p-2 rounded-full ${isOpen ? 'rotate-180 text-purple-600 bg-purple-50' : ''}`}>
                    <FiChevronDown className="w-5 h-5" />
                </div>
            </button>
            <div
                className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-4 pt-0 text-sm lg:text-base text-gray-600 leading-relaxed pl-16 pr-6 pb-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const ShippingReturns = () => {
    return (
        <div className="space-y-4">
            <AccordionItem icon={FiTruck} title="Informations de Livraison | معلومات الشحن" defaultOpen={true} delay="0s">
                <div className="space-y-4">
                    <div>
                        <p className="mb-2">Nous proposons une <strong>Livraison Express</strong> (24-48h) pour toutes les commandes.</p>
                        <ul className="space-y-2 mt-1">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                Commandes avant 14h expédiées le jour même
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                Numéro de suivi en temps réel
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                Emballage sécurisé
                            </li>
                        </ul>
                    </div>
                    <div className="text-right border-t pt-3 border-gray-100" dir="rtl">
                        <p className="mb-2">نقدم <strong>شحن سريع</strong> (24-48 ساعة) لجميع الطلبات.</p>
                        <ul className="space-y-2 mt-1">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                يتم شحن الطلبات قبل الساعة 2 ظهرًا في نفس اليوم
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                تتبع فوري للطلب
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                تغليف آمن
                            </li>
                        </ul>
                    </div>
                </div>
            </AccordionItem>
            <AccordionItem icon={FiRefreshCw} title="Politique de Retour | سياسة الاسترجاع" delay="0.1s">
                <div className="space-y-4">
                    <div>
                        <p className="mb-3">Nous souhaitons que vous soyez <strong>100% satisfait</strong>.</p>
                        <p>Retour possible sous <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">30 jours</span> pour remboursement ou échange si l'article est inutilisé.</p>
                    </div>
                    <div className="text-right border-t pt-3 border-gray-100" dir="rtl">
                        <p className="mb-3">نريدك أن تكون <strong>راضيًا بنسبة 100%</strong>.</p>
                        <p>يمكنك الإرجاع خلال <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">30 يومًا</span> لاسترداد المبلغ أو الاستبدال إذا كان المنتج غير مستخدم.</p>
                    </div>
                </div>
            </AccordionItem>
            <AccordionItem icon={FiShield} title="Garantie de Satisfaction | ضمان الرضا" delay="0.2s">
                <div className="space-y-4">
                    <div>
                        <p>Produits <strong>100% authentiques</strong> et contrôlés. Garantie satisfait ou remboursé.</p>
                    </div>
                    <div className="text-right border-t pt-3 border-gray-100" dir="rtl">
                        <p>منتجاتنا <strong>أصلية 100%</strong> ومفحوصة. ضمان استعادة الأموال إذا لم تكن راضيًا.</p>
                    </div>
                </div>
            </AccordionItem>
        </div>
    );
};

export default ShippingReturns;
