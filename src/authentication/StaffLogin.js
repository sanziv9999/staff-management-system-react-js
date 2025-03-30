import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from '../api';

// Translation dictionary
const translations = {
  en: {
    title: "Staff Login",
    resetPassword: "Reset Password",
    email: "Email",
    enterEmail: "Enter your email",
    password: "Password",
    enterPassword: "Enter your password",
    login: "Login",
    forgotPassword: "Forgot Password?",
    sendResetLink: "Send Reset Link",
    backToLogin: "Back to Login",
    noAccount: "Don't have an account?",
    registerHere: "Register here",
    loginSuccess: "Login successful!",
    loginFailed: "Login failed: ",
    enterEmailForReset: "Please enter your email.",
    resetLinkSent: "Password reset link sent to your email.",
    resetFailed: "Failed to send reset link: ",
    language: "Language"
  },
  ja: {
    title: "スタッフログイン",
    resetPassword: "パスワードリセット",
    email: "メールアドレス",
    enterEmail: "メールアドレスを入力してください",
    password: "パスワード",
    enterPassword: "パスワードを入力してください",
    login: "ログイン",
    forgotPassword: "パスワードをお忘れですか？",
    sendResetLink: "リセットリンクを送信",
    backToLogin: "ログインに戻る",
    noAccount: "アカウントをお持ちでない場合",
    registerHere: "こちらから登録",
    loginSuccess: "ログインに成功しました！",
    loginFailed: "ログインに失敗しました: ",
    enterEmailForReset: "メールアドレスを入力してください。",
    resetLinkSent: "パスワードリセットリンクをメールで送信しました。",
    resetFailed: "リセットリンクの送信に失敗しました: ",
    language: "言語"
  },
  ne: {
    title: "कर्मचारी लगइन",
    resetPassword: "पासवर्ड रिसेट",
    email: "इमेल",
    enterEmail: "आफ्नो इमेल प्रविष्ट गर्नुहोस्",
    password: "पासवर्ड",
    enterPassword: "आफ्नो पासवर्ड प्रविष्ट गर्नुहोस्",
    login: "लगइन गर्नुहोस्",
    forgotPassword: "पासवर्ड बिर्सनुभयो?",
    sendResetLink: "रिसेट लिङ्क पठाउनुहोस्",
    backToLogin: "लगइनमा फर्कनुहोस्",
    noAccount: "खाता छैन?",
    registerHere: "यहाँ दर्ता गर्नुहोस्",
    loginSuccess: "लगइन सफल भयो!",
    loginFailed: "लगइन असफल भयो: ",
    enterEmailForReset: "कृपया आफ्नो इमेल प्रविष्ट गर्नुहोस्।",
    resetLinkSent: "पासवर्ड रिसेट लिङ्क तपाईंको इमेलमा पठाइएको छ।",
    resetFailed: "रिसेट लिङ्क पठाउन असफल भयो: ",
    language: "भाषा"
  },
  hi: {
    title: "स्टाफ लॉगिन",
    resetPassword: "पासवर्ड रीसेट",
    email: "ईमेल",
    enterEmail: "अपना ईमेल दर्ज करें",
    password: "पासवर्ड",
    enterPassword: "अपना पासवर्ड दर्ज करें",
    login: "लॉगिन करें",
    forgotPassword: "पासवर्ड भूल गए?",
    sendResetLink: "रीसेट लिंक भेजें",
    backToLogin: "लॉगिन पर वापस जाएं",
    noAccount: "खाता नहीं है?",
    registerHere: "यहां पंजीकरण करें",
    loginSuccess: "लॉगिन सफल!",
    loginFailed: "लॉगिन असफल: ",
    enterEmailForReset: "कृपया अपना ईमेल दर्ज करें।",
    resetLinkSent: "पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है।",
    resetFailed: "रीसेट लिंक भेजने में विफल: ",
    language: "भाषा"
  }
};

function StaffLogin({ setToken, setIsStaff }) {
  const [language, setLanguage] = useState('en');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const navigate = useNavigate();

  const t = (key) => translations[language][key] || key;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/staff/login/`, credentials);
      const { access, is_staff, department, staff_id, user_name } = response.data;
      localStorage.clear();
      setToken(access);
      setIsStaff(is_staff);
      localStorage.setItem('token', access);
      localStorage.setItem('is_staff', is_staff);
      localStorage.setItem('department', department);
      localStorage.setItem('staff_id', staff_id);
      localStorage.setItem('user_name', user_name);
      setError('');
      toast.success(t('loginSuccess'), { autoClose: 2000 });
      navigate('/staff-dashboard');
    } catch (error) {
      console.error('Staff login error:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.non_field_errors?.[0] || error.response?.data?.error || error.message;
      setError(t('loginFailed') + errorMsg);
      toast.error(t('loginFailed') + errorMsg, { autoClose: 3000 });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError(t('enterEmailForReset'));
      toast.error(t('enterEmailForReset'), { autoClose: 3000 });
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/staff/password_reset/`, { email: forgotEmail });
      setForgotMessage(response.data.message || t('resetLinkSent'));
      setError('');
      toast.success(response.data.message || t('resetLinkSent'), { autoClose: 2000 });
      setForgotEmail('');
      setTimeout(() => setShowForgotPassword(false), 2000);
    } catch (error) {
      console.error('Forgot password error:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.email?.[0] || error.response?.data?.detail || error.message;
      setError(t('resetFailed') + errorMsg);
      toast.error(t('resetFailed') + errorMsg, { autoClose: 3000 });
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-extrabold text-gray-800">
            {showForgotPassword ? t('resetPassword') : t('title')}
          </h2>
          <div className="relative">
            <span className="mr-2">{t('language')}:</span>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="p-2 border rounded bg-white"
            >
              <option value="en">English</option>
              <option value="ja">日本語 (Japanese)</option>
              <option value="ne">नेपाली (Nepali)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>
        </div>

        {/* Login Form */}
        {!showForgotPassword ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                {t('email')}
              </label>
              <input
                type="email"
                id="email"
                placeholder={t('enterEmail')}
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                {t('password')}
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder={t('enterPassword')}
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
              {t('login')}
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
                {t('forgotPassword')}
              </button>
            </p>
          </form>
        ) : (
          /* Forgot Password Form */
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label htmlFor="forgot_email" className="block text-sm font-semibold text-gray-700 mb-1">
                {t('enterEmail')}
              </label>
              <input
                type="email"
                id="forgot_email"
                placeholder={t('enterEmail')}
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
              {t('sendResetLink')}
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
                {t('backToLogin')}
              </button>
            </p>
          </form>
        )}

        {/* Registration Link */}
        {!showForgotPassword && (
          <p className="text-center text-gray-600 mt-4">
            {t('noAccount')}{' '}
            <a href="/staff-registration" className="text-blue-600 hover:underline font-medium">
              {t('registerHere')}
            </a>
          </p>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default StaffLogin;