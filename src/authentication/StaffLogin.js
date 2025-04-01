import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from '../api';

// Translation dictionary with additional languages
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
  },
  my: { // Myanmar (Burmese)
    title: "ဝန်ထမ်းဝင်ရောက်မှု",
    resetPassword: "စကားဝှက်ပြန်လည်သတ်မှတ်ရန်",
    email: "အီးမေးလ်",
    enterEmail: "သင်၏အီးမေးလ်ကိုထည့်ပါ",
    password: "စကားဝှက်",
    enterPassword: "သင်၏စကားဝှက်ကိုထည့်ပါ",
    login: "ဝင်ရောက်ပါ",
    forgotPassword: "စကားဝှက်မေ့နေလား။",
    sendResetLink: "ပြန်လည်သတ်မှတ်လင့်ခ်ပို့ပါ",
    backToLogin: "ဝင်ရောက်မှုသို့ပြန်သွားပါ",
    noAccount: "အကောင့်မရှိဘူးလား။",
    registerHere: "ဒီမှာမှတ်ပုံတင်ပါ",
    loginSuccess: "ဝင်ရောက်မှုအောင်မြင်ပါပြီ။",
    loginFailed: "ဝင်ရောက်မှုမအောင်မြင်ပါ: ",
    enterEmailForReset: "ကျေးဇူးပြု၍ သင်၏အီးမေးလ်ကိုထည့်ပါ။",
    resetLinkSent: "စကားဝှက်ပြန်လည်သတ်မှတ်လင့်ခ်ကို သင်၏အီးမေးလ်သို့ပို့ပြီးပါပြီ။",
    resetFailed: "ပြန်လည်သတ်မှတ်လင့်ခ်ပို့ရန်မအောင်မြင်ပါ: ",
    language: "ဘာသာစကား"
  },
  'pt-BR': { // Brazil (Portuguese)
    title: "Login da Equipe",
    resetPassword: "Redefinir Senha",
    email: "E-mail",
    enterEmail: "Digite seu e-mail",
    password: "Senha",
    enterPassword: "Digite sua senha",
    login: "Entrar",
    forgotPassword: "Esqueceu a senha?",
    sendResetLink: "Enviar Link de Redefinição",
    backToLogin: "Voltar ao Login",
    noAccount: "Não tem uma conta?",
    registerHere: "Registre-se aqui",
    loginSuccess: "Login bem-sucedido!",
    loginFailed: "Falha no login: ",
    enterEmailForReset: "Por favor, digite seu e-mail.",
    resetLinkSent: "Link de redefinição de senha enviado para seu e-mail.",
    resetFailed: "Falha ao enviar o link de redefinição: ",
    language: "Idioma"
  },
  tl: { // Philippines (Filipino/Tagalog)
    title: "Login ng Staff",
    resetPassword: "I-reset ang Password",
    email: "Email",
    enterEmail: "Ilagay ang iyong email",
    password: "Password",
    enterPassword: "Ilagay ang iyong password",
    login: "Mag-login",
    forgotPassword: "Nakalimutan ang password?",
    sendResetLink: "Magpadala ng Reset Link",
    backToLogin: "Bumalik sa Login",
    noAccount: "Walang account?",
    registerHere: "Magrehistro dito",
    loginSuccess: "Matagumpay ang login!",
    loginFailed: "Hindi matagumpay ang login: ",
    enterEmailForReset: "Mangyaring ilagay ang iyong email.",
    resetLinkSent: "Naipadala ang link para i-reset ang password sa iyong email.",
    resetFailed: "Hindi naipadala ang reset link: ",
    language: "Wika"
  },
  bn: { // Bangladesh (Bengali)
    title: "কর্মচারী লগইন",
    resetPassword: "পাসওয়ার্ড রিসেট",
    email: "ইমেইল",
    enterEmail: "আপনার ইমেইল লিখুন",
    password: "পাসওয়ার্ড",
    enterPassword: "আপনার পাসওয়ার্ড লিখুন",
    login: "লগইন করুন",
    forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
    sendResetLink: "রিসেট লিঙ্ক পাঠান",
    backToLogin: "লগইনে ফিরে যান",
    noAccount: "অ্যাকাউন্ট নেই?",
    registerHere: "এখানে নিবন্ধন করুন",
    loginSuccess: "লগইন সফল!",
    loginFailed: "লগইন ব্যর্থ: ",
    enterEmailForReset: "দয়া করে আপনার ইমেইল লিখুন।",
    resetLinkSent: "পাসওয়ার্ড রিসেট লিঙ্ক আপনার ইমেইলে পাঠানো হয়েছে।",
    resetFailed: "রিসেট লিঙ্ক পাঠাতে ব্যর্থ: ",
    language: "ভাষা"
  },
  th: { // Thailand (Thai)
    title: "เข้าสู่ระบบพนักงาน",
    resetPassword: "รีเซ็ตรหัสผ่าน",
    email: "อีเมล",
    enterEmail: "กรุณากรอกอีเมลของคุณ",
    password: "รหัสผ่าน",
    enterPassword: "กรุณากรอกรหัสผ่านของคุณ",
    login: "เข้าสู่ระบบ",
    forgotPassword: "ลืมรหัสผ่าน?",
    sendResetLink: "ส่งลิงก์รีเซ็ต",
    backToLogin: "กลับไปที่การเข้าสู่ระบบ",
    noAccount: "ไม่มีบัญชี?",
    registerHere: "ลงทะเบียนที่นี่",
    loginSuccess: "เข้าสู่ระบบสำเร็จ!",
    loginFailed: "การเข้าสู่ระบบล้มเหลว: ",
    enterEmailForReset: "กรุณากรอกอีเมลของคุณ",
    resetLinkSent: "ลิงก์รีเซ็ตรหัสผ่านถูกส่งไปยังอีเมลของคุณแล้ว",
    resetFailed: "การส่งลิงก์รีเซ็ตล้มเหลว: ",
    language: "ภาษา"
  },
  vi: { // Vietnam (Vietnamese)
    title: "Đăng nhập nhân viên",
    resetPassword: "Đặt lại mật khẩu",
    email: "Email",
    enterEmail: "Nhập email của bạn",
    password: "Mật khẩu",
    enterPassword: "Nhập mật khẩu của bạn",
    login: "Đăng nhập",
    forgotPassword: "Quên mật khẩu?",
    sendResetLink: "Gửi liên kết đặt lại",
    backToLogin: "Quay lại đăng nhập",
    noAccount: "Chưa có tài khoản?",
    registerHere: "Đăng ký tại đây",
    loginSuccess: "Đăng nhập thành công!",
    loginFailed: "Đăng nhập thất bại: ",
    enterEmailForReset: "Vui lòng nhập email của bạn.",
    resetLinkSent: "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.",
    resetFailed: "Gửi liên kết đặt lại thất bại: ",
    language: "Ngôn ngữ"
  },
  'pt-PT': { // Portugal (Portuguese)
    title: "Login de Funcionários",
    resetPassword: "Redefinir Palavra-passe",
    email: "E-mail",
    enterEmail: "Insira o seu e-mail",
    password: "Palavra-passe",
    enterPassword: "Insira a sua palavra-passe",
    login: "Entrar",
    forgotPassword: "Esqueceu-se da palavra-passe?",
    sendResetLink: "Enviar Link de Redefinição",
    backToLogin: "Voltar ao Login",
    noAccount: "Não tem uma conta?",
    registerHere: "Registe-se aqui",
    loginSuccess: "Login bem-sucedido!",
    loginFailed: "Falha no login: ",
    enterEmailForReset: "Por favor, insira o seu e-mail.",
    resetLinkSent: "Link de redefinição de palavra-passe enviado para o seu e-mail.",
    resetFailed: "Falha ao enviar o link de redefinição: ",
    language: "Idioma"
  }
};

// Language options with flags
const languageOptions = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'ne', name: 'नेपाली (Nepali)', flag: '🇳🇵' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'my', name: 'မြန်မာ (Myanmar)', flag: '🇲🇲' },
  { code: 'pt-BR', name: 'Português (Brazil)', flag: '🇧🇷' },
  { code: 'tl', name: 'Filipino (Philippines)', flag: '🇵🇭' },
  { code: 'bn', name: 'বাংলা (Bangladesh)', flag: '🇧🇩' },
  { code: 'th', name: 'ไทย (Thailand)', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt (Vietnam)', flag: '🇻🇳' },
  { code: 'pt-PT', name: 'Português (Portugal)', flag: '🇵🇹' }
];

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
              {languageOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.flag} {option.name}
                </option>
              ))}
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