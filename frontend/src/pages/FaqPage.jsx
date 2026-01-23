import React from 'react';

const FaqPage = () => {
    const faqs = [
        {
            question: 'كم يستغرق التوصيل؟ / Quels sont les délais de livraison ?',
            answer: 'نقوم بالتوصيل لجميع المدن المغربية. يستغرق التوصيل 1-3 أيام للمدن الكبرى (الدار البيضاء، الرباط، طنجة، مراكش) و 2-5 أيام لباقي المدن. \n\n Nous livrons dans toutes les villes du Maroc. La livraison prend 1-3 jours pour les grandes villes (Casablanca, Rabat, Tanger, Marrakech) et 2-5 jours pour les autres villes.'
        },
        {
            question: 'هل الدفع عند الاستلام متوفر؟ / Le paiement à la livraison est-il disponible ?',
            answer: 'نعم! نحن نوفر خدمة الدفع عند الاستلام لجميع الطلبات. تدفع فقط عندما تستلم طلبيتك. \n\n Oui ! Nous proposons le paiement à la livraison pour toutes les commandes. Vous ne payez que lorsque vous recevez votre commande.'
        },
        {
            question: 'ما هي سياسة الاسترجاع؟ / Quelle est votre politique de retour ?',
            answer: 'يمكنك طلب استرجاع أي منتج غير مفتوح وفي حالته الأصلية خلال 30 يوماً من تاريخ الشراء. \n\n Vous pouvez retourner tout produit non ouvert et dans son état d\'origine dans les 30 jours suivant la date d\'achat.'
        },
        {
            question: 'هل المنتجات أصلية؟ / Les produits sont-ils originaux ?',
            answer: 'نضمن لكم أن جميع منتجاتنا أصلية 100% ومستوردة من مصادر موثوقة. \n\n Nous vous garantissons que tous nos produits sont 100% originaux et importés de sources fiables.'
        },
        {
            question: 'كيف يمكنني تتبع طلبي؟ / Comment suivre ma commande ?',
            answer: 'بمجرد شحن طلبك، ستتلقى رسالة نصية أو بريداً إلكترونياً يحتوي على رقم التتبع. \n\n Une fois votre commande expédiée, vous recevrez un SMS ou un e-mail contenant le numéro de suivi.'
        },
        {
            question: 'كيف يمكنني التواصل معكم؟ / Comment nous contacter ?',
            answer: 'يمكنكم التواصل معنا عبر صفحة "اتصل بنا" أو عبر الهاتف/واتساب للدعم الفوري. \n\n Vous pouvez nous contacter via la page "Contactez-nous" ou par téléphone/WhatsApp pour un support immédiat.'
        }
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <span className="text-5xl block mb-4">❓</span>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">الأسئلة الشائعة / Questions Fréquemment Posées</h1>
                <p className="text-gray-600 text-lg">
                    إجابات على أسئلتكم المتكررة / Réponses à vos questions fréquentes
                </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-start">
                            <span className="text-blue-500 ml-3 text-2xl">•</span>
                            {faq.question}
                        </h2>
                        <div className="text-gray-600 leading-relaxed pr-6 border-r-2 border-blue-100 mr-2 whitespace-pre-line">
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center mt-12 bg-blue-50 p-8 rounded-2xl max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    لم تجد إجابة لسؤالك؟ / Vous n'avez pas trouvé de réponse ?
                </h3>
                <p className="text-gray-600 mb-6">
                    فريقنا هنا للمساعدة / Notre équipe est là pour vous aider
                </p>
                <a href="/contact" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">
                    تواصل معنا / Contactez-nous
                </a>
            </div>
        </div>
    );
};

export default FaqPage;