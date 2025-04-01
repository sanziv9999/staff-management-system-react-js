import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../api';
import '../assets/css/dashboard.css';

// Translation dictionary
const translations = {
  en: {
    title: "Dashboard",
    totalStaff: "Total Staff",
    departments: "Departments",
    presentToday: "Present Today",
    monthlySalary: "Monthly Salary",
    loading: "Loading...",
    fetchError: "Failed to load dashboard data. Please ensure the backend server is running or check your login credentials.",
    language: "Language"
  },
  ja: {
    title: "ダッシュボード",
    totalStaff: "総スタッフ数",
    departments: "部門数",
    presentToday: "本日の出勤者",
    monthlySalary: "月間給与総額",
    loading: "読み込み中...",
    fetchError: "ダッシュボードデータの読み込みに失敗しました。バックエンドサーバーが実行されているか、ログイン資格情報を確認してください。",
    language: "言語"
  },
  ne: {
    title: "ड्यासबोर्ड",
    totalStaff: "कुल कर्मचारी",
    departments: "विभागहरू",
    presentToday: "आज उपस्थित",
    monthlySalary: "मासिक तलब",
    loading: "लोड हुँदै...",
    fetchError: "ड्यासबोर्ड डाटा लोड गर्न असफल भयो। कृपया ब्याकएन्ड सर्भर चलिरहेको छ कि छैन वा आफ्नो लगइन प्रमाणहरू जाँच गर्नुहोस्।",
    language: "भाषा"
  },
  hi: {
    title: "डैशबोर्ड",
    totalStaff: "कुल कर्मचारी",
    departments: "विभाग",
    presentToday: "आज उपस्थित",
    monthlySalary: "मासिक वेतन",
    loading: "लोड हो रहा है...",
    fetchError: "डैशबोर्ड डेटा लोड करने में विफल। कृपया सुनिश्चित करें कि बैकएंड सर्वर चल रहा है या अपने लॉगिन क्रेडेंशियल्स की जाँच करें।",
    language: "भाषा"
  },
  my: { // Myanmar (Burmese)
    title: "ဒက်ရှ်ဘုတ်",
    totalStaff: "ဝန်ထမ်းစုစုပေါင်း",
    departments: "ဌာနများ",
    presentToday: "ယနေ့တက်ရောက်သူ",
    monthlySalary: "လစဉ်လစာ",
    loading: "ဖွင့်နေသည်...",
    fetchError: "ဒက်ရှ်ဘုတ်ဒေတာကိုဖွင့်ရန်မအောင်မြင်ပါ။ ကျေးဇူးပြု၍ နောက်ကွယ်ဆာဗာလည်ပတ်နေသလား သို့မဟုတ် သင်၏လော့ဂ်အင်အထောက်အထားများကိုစစ်ဆေးပါ။",
    language: "ဘာသာစကား"
  },
  'pt-BR': { // Brazil (Portuguese)
    title: "Painel",
    totalStaff: "Total de Funcionários",
    departments: "Departamentos",
    presentToday: "Presentes Hoje",
    monthlySalary: "Salário Mensal",
    loading: "Carregando...",
    fetchError: "Falha ao carregar os dados do painel. Verifique se o servidor backend está em execução ou confira suas credenciais de login.",
    language: "Idioma"
  },
  tl: { // Philippines (Filipino/Tagalog)
    title: "Dashboard",
    totalStaff: "Kabuuan ng Kawani",
    departments: "Mga Kagawaran",
    presentToday: "Dumalo Ngayon",
    monthlySalary: "Buwanang Sahod",
    loading: "Nilo-load...",
    fetchError: "Nabigo sa pag-load ng datos ng dashboard. Siguraduhing tumatakbo ang backend server o suriin ang iyong mga kredensyal sa pag-login.",
    language: "Wika"
  },
  bn: { // Bangladesh (Bengali)
    title: "ড্যাশবোর্ড",
    totalStaff: "মোট কর্মী",
    departments: "বিভাগ",
    presentToday: "আজ উপস্থিত",
    monthlySalary: "মাসিক বেতন",
    loading: "লোড হচ্ছে...",
    fetchError: "ড্যাশবোর্ড ডেটা লোড করতে ব্যর্থ। অনুগ্রহ করে নিশ্চিত করুন যে ব্যাকএন্ড সার্ভার চলছে বা আপনার লগইন শংসাপত্র পরীক্ষা করুন।",
    language: "ভাষা"
  },
  th: { // Thailand (Thai)
    title: "แดชบอร์ด",
    totalStaff: "จำนวนพนักงานทั้งหมด",
    departments: "แผนก",
    presentToday: "มาทำงานวันนี้",
    monthlySalary: "เงินเดือนรายเดือน",
    loading: "กำลังโหลด...",
    fetchError: "ไม่สามารถโหลดข้อมูลแดชบอร์ดได้ กรุณาตรวจสอบว่าเซิร์ฟเวอร์ backend ทำงานอยู่หรือตรวจสอบข้อมูลการเข้าสู่ระบบของคุณ",
    language: "ภาษา"
  },
  vi: { // Vietnam (Vietnamese)
    title: "Bảng Điều Khiển",
    totalStaff: "Tổng Nhân Viên",
    departments: "Phòng Ban",
    presentToday: "Có Mặt Hôm Nay",
    monthlySalary: "Lương Hàng Tháng",
    loading: "Đang tải...",
    fetchError: "Không thể tải dữ liệu bảng điều khiển. Vui lòng đảm bảo máy chủ backend đang chạy hoặc kiểm tra thông tin đăng nhập của bạn.",
    language: "Ngôn ngữ"
  },
  'pt-PT': { // Portugal (Portuguese)
    title: "Painel",
    totalStaff: "Total de Funcionários",
    departments: "Departamentos",
    presentToday: "Presentes Hoje",
    monthlySalary: "Salário Mensal",
    loading: "A carregar...",
    fetchError: "Falha ao carregar os dados do painel. Certifique-se de que o servidor backend está em execução ou verifique as suas credenciais de login.",
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

function Dashboard({ token }) {
  const [language, setLanguage] = useState('en');
  const [stats, setStats] = useState({
    totalStaff: 0,
    departments: 0,
    presentToday: 0,
    totalSalary: 0,
  });
  const [currency, setCurrency] = useState('¥');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const t = (key) => translations[language][key] || key;

  // Handle language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchData = async () => {
      try {
        const settingsRes = await axios.get(`${API_BASE_URL}/settings/1/`);
        const currencySymbol = settingsRes.data.currency.split('-')[1];
        setCurrency(currencySymbol);
        setCompanyName(settingsRes.data.company_name);

        const [staffRes, deptRes, attendanceRes, salaryRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/staff/`),
          axios.get(`${API_BASE_URL}/departments/`),
          axios.get(`${API_BASE_URL}/attendance/`, {
            params: { date: new Date().toISOString().split('T')[0] },
          }),
          axios.get(`${API_BASE_URL}/salaries/`),
        ]);

        setStats({
          totalStaff: staffRes.data.length,
          departments: deptRes.data.length,
          presentToday: attendanceRes.data.filter(a => a.status === 'Present').length,
          totalSalary: salaryRes.data.reduce(
            (sum, s) =>
              sum +
              (parseFloat(s.base_salary) || 0) +
              (parseFloat(s.bonus) || 0) -
              (parseFloat(s.deductions) || 0),
            0
          ),
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(t('fetchError'));
      }
    };

    fetchData();
  }, [token, navigate, language]);

  return (
    <div className="container mx-auto">
      {/* Navbar for Language Selection */}
      <nav className="bg-gray-800 p-4 mb-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">{t('title')}</h1>
          <div className="flex space-x-4 items-center">
            <span className="text-white">{t('language')}:</span>
            {languageOptions.map((option) => (
              <button
                key={option.code}
                onClick={() => handleLanguageChange(option.code)}
                className={`text-white ${language === option.code ? 'font-bold' : ''} hover:underline flex items-center`}
              >
                <span className="mr-1">{option.flag}</span>
                {option.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
      <div className="bg-blue-100 p-4 rounded shadow mb-6">
        <h1 className="text-3xl font-extrabold text-blue-800 animate-fadeIn">
          {companyName || t('loading')}
        </h1>
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">{t('totalStaff')}</h3>
          <p className="text-3xl">{stats.totalStaff}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">{t('departments')}</h3>
          <p className="text-3xl">{stats.departments}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">{t('presentToday')}</h3>
          <p className="text-3xl">{stats.presentToday}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">{t('monthlySalary')}</h3>
          <p className="text-3xl">
            {currency}{stats.totalSalary.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;