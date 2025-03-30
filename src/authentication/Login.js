import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from '../api';

// Language translations
const translations = {
  en: {
    login: 'Login',
    resetPassword: 'Reset Password',
    username: 'Username',
    enterUsername: 'Enter your username',
    password: 'Password',
    enterPassword: 'Enter your password',
    loginButton: 'Login',
    forgotPassword: 'Forgot Password?',
    enterEmail: 'Enter your email',
    emailPlaceholder: 'Email for password reset',
    sendResetLink: 'Send Reset Link',
    backToLogin: 'Back to Login',
    loginSuccess: 'Login successful!',
    loginFailed: 'Login failed: ',
    pleaseEnterEmail: 'Please enter your email.',
    resetLinkSent: 'Password reset link sent to your email.',
    failedToSend: 'Failed to send reset link: '
  },
  ja: {
    login: 'ログイン',
    resetPassword: 'パスワードを再設定する',
    username: 'ユーザー名',
    enterUsername: 'ユーザー名を入力してください',
    password: 'パスワード',
    enterPassword: 'パスワードを入力してください',
    loginButton: 'ログイン',
    forgotPassword: 'パスワードをお忘れですか？',
    enterEmail: 'メールアドレスを入力してください',
    emailPlaceholder: 'パスワード再設定用メールアドレス',
    sendResetLink: '再設定リンクを送信',
    backToLogin: 'ログインに戻る',
    loginSuccess: 'ログインに成功しました！',
    loginFailed: 'ログインに失敗しました: ',
    pleaseEnterEmail: 'メールアドレスを入力してください。',
    resetLinkSent: 'パスワード再設定リンクをメールで送信しました。',
    failedToSend: '再設定リンクの送信に失敗しました: '
  },
  ne: {
    login: 'लगइन',
    resetPassword: 'पासवर्ड रिसेट गर्नुहोस्',
    username: 'प्रयोगकर्ता नाम',
    enterUsername: 'आफ्नो प्रयोगकर्ता नाम प्रविष्ट गर्नुहोस्',
    password: 'पासवर्ड',
    enterPassword: 'आफ्नो पासवर्ड प्रविष्ट गर्नुहोस्',
    loginButton: 'लगइन',
    forgotPassword: 'पासवर्ड भुल्नुभयो?',
    enterEmail: 'आफ्नो इमेल प्रविष्ट गर्नुहोस्',
    emailPlaceholder: 'पासवर्ड रिसेट गर्न इमेल',
    sendResetLink: 'रिसेट लिङ्क पठाउनुहोस्',
    backToLogin: 'लगइनमा फर्कनुहोस्',
    loginSuccess: 'लगइन सफल भयो!',
    loginFailed: 'लगइन असफल भयो: ',
    pleaseEnterEmail: 'कृपया आफ्नो इमेल प्रविष्ट गर्नुहोस्।',
    resetLinkSent: 'पासवर्ड रिसेट लिङ्क तपाईंको इमेलमा पठाईयो।',
    failedToSend: 'रिसेट लिङ्क पठाउन असफल भयो: '
  },
  hi: {
    login: 'लॉग इन',
    resetPassword: 'पासवर्ड रीसेट करें',
    username: 'उपयोगकर्ता नाम',
    enterUsername: 'अपना उपयोगकर्ता नाम दर्ज करें',
    password: 'पासवर्ड',
    enterPassword: 'अपना पासवर्ड दर्ज करें',
    loginButton: 'लॉग इन',
    forgotPassword: 'पासवर्ड भूल गए?',
    enterEmail: 'अपना ईमेल दर्ज करें',
    emailPlaceholder: 'पासवर्ड रीसेट के लिए ईमेल',
    sendResetLink: 'रीसेट लिंक भेजें',
    backToLogin: 'लॉग इन पर वापस जाएं',
    loginSuccess: 'लॉग इन सफल!',
    loginFailed: 'लॉग इन विफल: ',
    pleaseEnterEmail: 'कृपया अपना ईमेल दर्ज करें।',
    resetLinkSent: 'पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है।',
    failedToSend: 'रीसेट लिंक भेजने में विफल: '
  }
};

function Login({ setToken, setIsAdmin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [language, setLanguage] = useState('en');
  const navigate = useNavigate();

  const t = translations[language];

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/login/`, credentials);
      const { access, is_admin } = response.data;
      setToken(access);
      setIsAdmin(is_admin);
      localStorage.setItem('token', access);
      localStorage.setItem('is_admin', is_admin);
      setError('');
      toast.success(t.loginSuccess, { autoClose: 2000 });
      navigate(is_admin ? '/' : '/user-dashboard');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.non_field_errors?.[0] || error.response?.data?.error || error.message;
      setError(t.loginFailed + errorMsg);
      toast.error(t.loginFailed + errorMsg, { autoClose: 3000 });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError(t.pleaseEnterEmail);
      toast.error(t.pleaseEnterEmail, { autoClose: 3000 });
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/password_reset/`, { email: forgotEmail });
      setForgotMessage(response.data.message || t.resetLinkSent);
      setError('');
      toast.success(response.data.message || t.resetLinkSent, { autoClose: 2000 });
      setForgotEmail('');
      setTimeout(() => setShowForgotPassword(false), 2000);
    } catch (error) {
      console.error('Forgot password error:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.email?.[0] || error.response?.data?.detail || error.message;
      setError(t.failedToSend + errorMsg);
      toast.error(t.failedToSend + errorMsg, { autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Language Selector */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button 
            onClick={() => setLanguage('en')} 
            className={`px-2 py-1 text-xs rounded ${language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('ja')} 
            className={`px-2 py-1 text-xs rounded ${language === 'ja' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            日本語
          </button>
          <button 
            onClick={() => setLanguage('ne')} 
            className={`px-2 py-1 text-xs rounded ${language === 'ne' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            नेपाली
          </button>
          <button 
            onClick={() => setLanguage('hi')} 
            className={`px-2 py-1 text-xs rounded ${language === 'hi' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            हिन्दी
          </button>
        </div>

        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          {showForgotPassword ? t.resetPassword : t.login}
        </h2>

        {/* Login Form */}
        {!showForgotPassword ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">
                {t.username}
              </label>
              <input
                type="text"
                id="username"
                placeholder={t.enterUsername}
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                {t.password}
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder={t.enterPassword}
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {error && <p className="text-red-500 text-center font-medium">{error}</p>}
            <button
              type="submit"
              className="w-full p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition font-semibold"
            >
              {t.loginButton}
            </button>
            <p className="text-center text-gray-600">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(true);
                  setError('');
                }}
                className="text-blue-600 hover:underline font-medium"
              >
                {t.forgotPassword}
              </button>
            </p>
          </form>
        ) : (
          /* Forgot Password Form */
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label htmlFor="forgot_email" className="block text-sm font-semibold text-gray-700 mb-1">
                {t.enterEmail}
              </label>
              <input
                type="email"
                id="forgot_email"
                placeholder={t.emailPlaceholder}
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400"
                required
              />
            </div>
            {error && <p className="text-red-500 text-center font-medium">{error}</p>}
            {forgotMessage && <p className="text-green-500 text-center font-medium">{forgotMessage}</p>}
            <button
              type="submit"
              className="w-full p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition font-semibold"
            >
              {t.sendResetLink}
            </button>
            <p className="text-center text-gray-600">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setError('');
                  setForgotMessage('');
                }}
                className="text-blue-600 hover:underline font-medium"
              >
                {t.backToLogin}
              </button>
            </p>
          </form>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default Login;