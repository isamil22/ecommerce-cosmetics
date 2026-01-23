// frontend/src/pages/AuthPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, registerUser, getUserProfile } from '../api/apiService';
import ReCAPTCHA from 'react-google-recaptcha';

const AuthPage = ({ setIsAuthenticated }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
        setError(''); // Clear error when user interacts with reCAPTCHA
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!recaptchaToken) {
            setError('يرجى إكمال اختبار reCAPTCHA. / Veuillez compléter le reCAPTCHA.');
            return;
        }

        try {
            if (isLogin) {
                const response = await loginUser({
                    email: formData.email,
                    password: formData.password,
                    recaptchaToken,
                });
                localStorage.setItem('token', response.data);
                setIsAuthenticated(true);

                // Get user profile to determine redirection based on dashboard access
                try {
                    const profileResponse = await getUserProfile();
                    if (profileResponse.data.hasDashboardAccess) {
                        navigate('/admin/dashboard');
                    } else {
                        navigate('/profile');
                    }
                } catch (error) {
                    console.error("Could not fetch user profile for redirection", error);
                    navigate('/profile'); // Fallback to profile page
                }
            } else {
                await registerUser({ ...formData, recaptchaToken });
                setSuccess('تم التسجيل بنجاح! تم إرسال رمز التأكيد إلى بريدك الإلكتروني. / Inscription réussie ! Un code de confirmation a été envoyé à votre email.');
                setTimeout(() => navigate(`/confirm-email/${formData.email}`), 3000);
            }
        } catch (err) {
            const errorMessage = err.response?.data || 'حدث خطأ غير متوقع. / Une erreur inattendue s\'est produite.';
            setError(typeof errorMessage === 'string' ? errorMessage : 'فشل تسجيل الدخول أو التسجيل. / Échec de la connexion ou de l\'inscription.');
            console.error(err);
        } finally {
            // Reset reCAPTCHA after submission attempt if needed, though it often resets on its own
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError('');
        setSuccess('');
        setFormData({ fullName: '', email: '', password: '' });
        setRecaptchaToken(null);
        setShowPassword(false);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 overflow-hidden">
            {/* Animated Background Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 via-purple-400/10 to-blue-400/10"></div>

            {/* Floating Decorative Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            <div className="relative max-w-md w-full z-10">
                {/* Logo/Brand Area */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg mb-4 transform hover:rotate-6 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white/90 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden">
                    {/* Decorative top gradient bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            {isLogin ? 'مرحباً بعودتك! / Bon retour !' : 'انضم إلينا اليوم / Rejoignez-nous'}
                        </h2>
                        <p className="text-sm text-gray-600 font-medium">
                            {isLogin ? 'سجل الدخول لمتابعة رحلتك / Connectez-vous pour continuer' : 'أنشئ حساباً وابدأ التسوق / Créez un compte et commencez vos achats'}
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Full Name Field */}
                        {!isLogin && (
                            <div className="space-y-2 transform transition-all duration-300">
                                <label
                                    htmlFor="full-name"
                                    className="block text-xs font-bold text-gray-700 uppercase tracking-wider text-right"
                                >
                                    الاسم الكامل / Nom Complet
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="full-name"
                                        name="fullName"
                                        type="text"
                                        required={!isLogin}
                                        className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 hover:shadow-md bg-white text-right"
                                        placeholder="الاسم الكامل / Nom complet"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email-address"
                                className="block text-xs font-bold text-gray-700 uppercase tracking-wider text-right"
                            >
                                البريد الإلكتروني / Adresse Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 hover:shadow-md bg-white"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="block text-xs font-bold text-gray-700 uppercase tracking-wider text-right"
                            >
                                كلمة المرور / Mot de passe
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                    required
                                    className="appearance-none block w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 hover:shadow-md bg-white"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        {isLogin && (
                            <div className="flex justify-end dir-rtl">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors duration-200 hover:underline"
                                >
                                    نسيت كلمة المرور؟ / Mot de passe oublié ?
                                </Link>
                            </div>
                        )}

                        {/* ReCAPTCHA */}
                        <div className="flex justify-center py-4">
                            <div className="transform transition-all duration-200 hover:scale-105">
                                <ReCAPTCHA
                                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || 'YOUR_FALLBACK_SITE_KEY'}
                                    onChange={handleRecaptchaChange}
                                    onExpired={() => setRecaptchaToken(null)}
                                />
                            </div>
                        </div>

                        {/* Success Message */}
                        {success && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-700 px-4 py-3.5 rounded-lg text-sm font-medium shadow-sm animate-slideIn">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>{success}</span>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 text-red-700 px-4 py-3.5 rounded-lg text-sm font-medium shadow-sm animate-shake">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-700 hover:via-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-2xl"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                                    <svg className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {isLogin ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        )}
                                    </svg>
                                </span>
                                {isLogin ? 'تسجيل الدخول / Se connecter' : 'إنشاء حساب / S\'inscrire'}
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500 font-medium">أو / OU</span>
                        </div>
                    </div>

                    {/* Toggle Form Link */}
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>{isLogin ? "ليس لديك حساب؟ / Pas de compte ?" : 'لديك حساب بالفعل؟ / Déjà inscrit ?'}</span>
                        <button
                            onClick={toggleForm}
                            className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 transition-all duration-200"
                        >
                            {isLogin ? 'أنشئ حساباً الآن → / Créez-en un' : 'سجل الدخول هنا → / Connectez-vous'}
                        </button>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-500">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">محمية بواسطة reCAPTCHA وتشفير SSL / Sécurisé par reCAPTCHA et cryptage SSL</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;