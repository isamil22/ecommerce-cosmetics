// frontend/src/pages/AuthPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, registerUser } from '../api/apiService';
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
            setError('Please complete the reCAPTCHA.');
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
                navigate('/profile');
            } else {
                await registerUser({ ...formData, recaptchaToken });
                setSuccess('Registration successful! A confirmation code has been sent to your email.');
                setTimeout(() => navigate(`/confirm-email/${formData.email}`), 3000);
            }
        } catch (err) {
            const errorMessage = err.response?.data || 'An unexpected error occurred.';
            setError(typeof errorMessage === 'string' ? errorMessage : 'Login or registration failed.');
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
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 via-purple-400/10 to-blue-400/10"></div>
            
            <div className="relative max-w-md w-full">
                <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-2xl shadow-2xl border border-white/20">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {isLogin ? 'Sign in to continue your journey' : 'Join us and start shopping'}
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Full Name Field */}
                        {!isLogin && (
                            <div className="space-y-2">
                                <label 
                                    htmlFor="full-name" 
                                    className="block text-xs font-semibold text-gray-700 uppercase tracking-wide"
                                >
                                    Full Name
                                </label>
                                <input
                                    id="full-name"
                                    name="fullName"
                                    type="text"
                                    required={!isLogin}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="email-address" 
                                className="block text-xs font-semibold text-gray-700 uppercase tracking-wide"
                            >
                                Email Address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="password" 
                                className="block text-xs font-semibold text-gray-700 uppercase tracking-wide"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={isLogin ? "current-password" : "new-password"}
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Forgot Password Link */}
                        {isLogin && (
                            <div className="flex justify-end">
                                <Link 
                                    to="/forgot-password" 
                                    className="text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors duration-200"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        )}

                        {/* ReCAPTCHA */}
                        <div className="flex justify-center py-4">
                            <ReCAPTCHA
                                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || 'YOUR_FALLBACK_SITE_KEY'}
                                onChange={handleRecaptchaChange}
                                onExpired={() => setRecaptchaToken(null)}
                            />
                        </div>

                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium text-center">
                                ✓ {success}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium text-center">
                                ✕ {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                            >
                                {isLogin ? 'Sign In' : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    {/* Toggle Form Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}
                            {' '}
                            <button 
                                onClick={toggleForm} 
                                className="font-semibold text-pink-600 hover:text-pink-700 transition-colors duration-200"
                            >
                                {isLogin ? 'Create one' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;