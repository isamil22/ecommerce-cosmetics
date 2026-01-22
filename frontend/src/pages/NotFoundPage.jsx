import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center max-w-lg border border-pink-100">
                <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-5xl">🤔</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    404
                </h1>

                <h2 className="text-2xl font-bold text-gray-700 mb-4">
                    الصفحة غير موجودة<br />
                    Page Non Trouvée
                </h2>

                <p className="text-gray-500 mb-8 leading-relaxed">
                    عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
                    <br />
                    Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>العودة للرئيسية / Retour à l'accueil</span>
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
