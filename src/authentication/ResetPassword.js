import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api';

// Translation dictionary with all requested languages
const translations = {
  en: {
    title: "Reset Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    resetPassword: "Reset Password",
    backToLogin: "Back to Login",
    login: "Login",
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
    login: "ログイン",
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
    login: "लगइन",
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
    login: "लॉग इन",
    language: "भाषा",
    errorPasswordsNotMatch: "पासवर्ड मेल नहीं खाते।",
    errorResetFailed: "पासवर्ड रीसेट करने में विफल।"
  },
  my: { // Myanmar (Burmese)
    title: "စကားဝှက်ပြန်လည်သတ်မှတ်ရန်",
    newPassword: "စကားဝှက်အသစ်",
    confirmPassword: "စကားဝှက်အတည်ပြုရန်",
    resetPassword: "စကားဝှက်ပြန်လည်သတ်မှတ်ရန်",
    backToLogin: "အကောင့်ဝင်ရန်သို့ပြန်သွားရန်",
    login: "အကောင့်ဝင်ရန်",
    language: "ဘာသာစကား",
    errorPasswordsNotMatch: "စကားဝှက်များမကိုက်ညီပါ။",
    errorResetFailed: "စကားဝှက်ပြန်လည်သတ်မှတ်ရန်မအောင်မြင်ပါ။"
  },
  pt: { // Portuguese (Brazil/Portugal)
    title: "Redefinir Senha",
    newPassword: "Nova Senha",
    confirmPassword: "Confirmar Senha",
    resetPassword: "Redefinir Senha",
    backToLogin: "Voltar para Login",
    login: "Entrar",
    language: "Idioma",
    errorPasswordsNotMatch: "As senhas não coincidem.",
    errorResetFailed: "Falha ao redefinir a senha."
  },
  fil: { // Filipino (Philippines)
    title: "I-reset ang Password",
    newPassword: "Bagong Password",
    confirmPassword: "Kumpirmahin ang Password",
    resetPassword: "I-reset ang Password",
    backToLogin: "Bumalik sa Pag-login",
    login: "Mag-login",
    language: "Wika",
    errorPasswordsNotMatch: "Hindi magkatugma ang mga password.",
    errorResetFailed: "Nabigong i-reset ang password."
  },
  bn: { // Bengali (Bangladesh)
    title: "পাসওয়ার্ড রিসেট করুন",
    newPassword: "নতুন পাসওয়ার্ড",
    confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
    resetPassword: "পাসওয়ার্ড রিসেট করুন",
    backToLogin: "লগইনে ফিরে যান",
    login: "লগইন",
    language: "ভাষা",
    errorPasswordsNotMatch: "পাসওয়ার্ড মেলে না।",
    errorResetFailed: "পাসওয়ার্ড রিসেট করতে ব্যর্থ হয়েছে।"
  },
  th: { // Thai (Thailand)
    title: "รีเซ็ตรหัสผ่าน",
    newPassword: "รหัสผ่านใหม่",
    confirmPassword: "ยืนยันรหัสผ่าน",
    resetPassword: "รีเซ็ตรหัสผ่าน",
    backToLogin: "กลับไปที่เข้าสู่ระบบ",
    login: "เข้าสู่ระบบ",
    language: "ภาษา",
    errorPasswordsNotMatch: "รหัสผ่านไม่ตรงกัน",
    errorResetFailed: "รีเซ็ตรหัสผ่านไม่สำเร็จ"
  },
  vi: { // Vietnamese (Vietnam)
    title: "Đặt lại mật khẩu",
    newPassword: "Mật khẩu mới",
    confirmPassword: "Xác nhận mật khẩu",
    resetPassword: "Đặt lại mật khẩu",
    backToLogin: "Quay lại đăng nhập",
    login: "Đăng nhập",
    language: "Ngôn ngữ",
    errorPasswordsNotMatch: "Mật khẩu không khớp.",
    errorResetFailed: "Đặt lại mật khẩu thất bại."
  }
};

// Flag emojis for each language
const languageFlags = {
  en: '🇬🇧',
  ja: '🇯🇵',
  ne: '🇳🇵',
  hi: '🇮🇳',
  my: '🇲🇲',
  pt: '🇧🇷',
  fil: '🇵🇭',
  bn: '🇧🇩',
  th: '🇹🇭',
  vi: '🇻🇳'
};

function ResetPassword() {
  const [language, setLanguage] = useState('en');
  const [formData, setFormData] = useState({ new_password: '', confirm_password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams();
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
          <div className="flex flex-wrap gap-2 justify-end">
            {Object.entries(languageFlags).map(([langCode, flag]) => (
              <button
                key={langCode}
                onClick={() => handleLanguageChange(langCode)}
                className={`px-2 py-1 text-xs rounded flex items-center ${language === langCode ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                <span className="mr-1">{flag}</span> {translations[langCode].login}
              </button>
            ))}
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