import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api';

// Translation dictionary
const translations = {
  en: {
    title: "Reset Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    resetPassword: "Reset Password",
    backToLogin: "Back to Login",
    language: "Language",
    errorPasswordsNotMatch: "Passwords do not match.",
    errorResetFailed: "Failed to reset password."
  },
  ja: {
    title: "パスワードリセット",
    newPassword: "新しいパスワード",
    confirmPassword: "パスワードの確認",
    resetPassword: "パスワードをリセット",
    backToLogin: "ログインに戻る",
    language: "言語",
    errorPasswordsNotMatch: "パスワードが一致しません。",
    errorResetFailed: "パスワードのリセットに失敗しました。"
  },
  ne: {
    title: "पासवर्ड रिसेट",
    newPassword: "नयाँ पासवर्ड",
    confirmPassword: "पासवर्ड पुष्टि गर्नुहोस्",
    resetPassword: "पासवर्ड रिसेट गर्नुहोस्",
    backToLogin: "लगइनमा फर्कनुहोस्",
    language: "भाषा",
    errorPasswordsNotMatch: "पासवर्डहरू मेल खाँदैनन्।",
    errorResetFailed: "पासवर्ड रिसेट गर्न असफल भयो।"
  },
  hi: {
    title: "पासवर्ड रीसेट",
    newPassword: "नया पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    resetPassword: "पासवर्ड रीसेट करें",
    backToLogin: "लॉगिन पर वापस जाएं",
    language: "भाषा",
    errorPasswordsNotMatch: "पासवर्ड मेल नहीं खाते।",
    errorResetFailed: "पासवर्ड रीसेट करने में विफल।"
  }
};

function ResetPassword() {
  const [language, setLanguage] = useState('en');
  const [formData, setFormData] = useState({ new_password: '', confirm_password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();

  // Load language preference from localStorage
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const t = (key) => translations[language][key] || key;

  // Handle language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      setError(t('errorPasswordsNotMatch'));
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/staff/password_reset/confirm/`, {
        token,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      });
      setMessage(response.data.message || 'Password reset successfully! Redirecting to login...');
      setError('');
      setTimeout(() => navigate('/staff-login'), 2000);
    } catch (error) {
      console.error('Reset password error:', error.response?.data || error.message);
      setError(error.response?.data?.detail || t('errorResetFailed'));
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col p-6">
      {/* Navbar for Language Selection */}
      <nav className="bg-gray-800 p-4 mb-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">{t('title')}</h1>
          <div className="flex space-x-4">
            <span className="text-white">{t('language')}:</span>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`text-white ${language === 'en' ? 'font-bold' : ''} hover:underline`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('ja')}
              className={`text-white ${language === 'ja' ? 'font-bold' : ''} hover:underline`}
            >
              日本語
            </button>
            <button
              onClick={() => handleLanguageChange('ne')}
              className={`text-white ${language === 'ne' ? 'font-bold' : ''} hover:underline`}
            >
              नेपाली
            </button>
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`text-white ${language === 'hi' ? 'font-bold' : ''} hover:underline`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </nav>

      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">{t('title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="new_password" className="block text-sm font-semibold text-gray-700 mb-1">
              {t('newPassword')}
            </label>
            <input
              type="password"
              id="new_password"
              name="new_password"
              placeholder={t('newPassword')}
              value={formData.new_password}
              onChange={handleChange}
              className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400"
              required
            />
          </div>
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-semibold text-gray-700 mb-1">
              {t('confirmPassword')}
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              placeholder={t('confirmPassword')}
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400"
              required
            />
          </div>
          {error && <p className="text-red-500 text-center font-medium">{error}</p>}
          {message && <p className="text-green-500 text-center font-medium">{message}</p>}
          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition font-semibold"
          >
            {t('resetPassword')}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          {t('backToLogin')}{' '}
          <a href="/staff-login" className="text-blue-600 hover:underline font-medium">
            {t('login')}
          </a>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;