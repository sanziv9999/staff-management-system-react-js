import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiChevronDown } from 'react-icons/fi';

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Admin';
  const userRole = localStorage.getItem('is_staff') === 'true' ? 'Staff' : 'Admin';
  
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // Supported languages with their codes, display names, and flags
  const languages = [
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/16x12/gb.png' },
    { code: 'ja', name: '日本語 (Japanese)', flag: 'https://flagcdn.com/16x12/jp.png' },
    { code: 'ne', name: 'नेपाली (Nepali)', flag: 'https://flagcdn.com/16x12/np.png' },
    { code: 'hi', name: 'हिन्दी (Hindi)', flag: 'https://flagcdn.com/16x12/in.png' },
    { code: 'my', name: 'မြန်မာ (Myanmar)', flag: 'https://flagcdn.com/16x12/mm.png' },
    { code: 'pt-BR', name: 'Português (Brazil)', flag: 'https://flagcdn.com/16x12/br.png' },
    { code: 'tl', name: 'Filipino (Philippines)', flag: 'https://flagcdn.com/16x12/ph.png' },
    { code: 'bn', name: 'বাংলা (Bangladesh)', flag: 'https://flagcdn.com/16x12/bd.png' },
    { code: 'th', name: 'ไทย (Thailand)', flag: 'https://flagcdn.com/16x12/th.png' },
    { code: 'vi', name: 'Tiếng Việt (Vietnam)', flag: 'https://flagcdn.com/16x12/vn.png' },
    { code: 'pt-PT', name: 'Português (Portugal)', flag: 'https://flagcdn.com/16x12/pt.png' },
  ];

  // Load saved language preference on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    const langObj = languages.find(lang => lang.code === savedLanguage);
    if (langObj) {
      setSelectedLanguage(langObj.name);
    }
  }, []);

  const handleLogout = () => {
    onLogout();
    localStorage.clear();
    navigate('/');
  };

  const handleLanguageSelect = (language) => {
    const selectedLang = languages.find(lang => lang.name === language);
    if (selectedLang) {
      setSelectedLanguage(language);
      setIsLanguageOpen(false);
      localStorage.setItem('language', selectedLang.code);
      window.location.reload(); // Refresh to apply language changes
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsUserOpen(false);
  };

  // Translations for navbar items
  const navbarTranslations = {
    en: {
      systemName: "Staff Management System",
      notifications: "Notifications",
      profile: "Profile",
      logout: "Logout"
    },
    ja: {
      systemName: "スタッフ管理システム",
      notifications: "通知",
      profile: "プロフィール",
      logout: "ログアウト"
    },
    ne: {
      systemName: "कर्मचारी व्यवस्थापन प्रणाली",
      notifications: "सूचनाहरू",
      profile: "प्रोफाइल",
      logout: "लगआउट"
    },
    hi: {
      systemName: "स्टाफ प्रबंधन प्रणाली",
      notifications: "सूचनाएं",
      profile: "प्रोफ़ाइल",
      logout: "लॉगआउट"
    },
    my: { // Myanmar (Burmese)
      systemName: "ဝန်ထမ်းစီမံခန့်ခွဲမှုစနစ်",
      notifications: "အသိပေးချက်များ",
      profile: "ပရိုဖိုင်",
      logout: "ထွက်ရန်"
    },
    'pt-BR': { // Brazil (Portuguese)
      systemName: "Sistema de Gestão de Funcionários",
      notifications: "Notificações",
      profile: "Perfil",
      logout: "Sair"
    },
    tl: { // Philippines (Filipino/Tagalog)
      systemName: "Sistema ng Pamamahala ng Staff",
      notifications: "Mga Notipikasyon",
      profile: "Profile",
      logout: "Mag-logout"
    },
    bn: { // Bangladesh (Bengali)
      systemName: "কর্মচারী ব্যবস্থাপনা সিস্টেম",
      notifications: "বিজ্ঞপ্তি",
      profile: "প্রোফাইল",
      logout: "লগআউট"
    },
    th: { // Thailand (Thai)
      systemName: "ระบบการจัดการพนักงาน",
      notifications: "การแจ้งเตือน",
      profile: "โปรไฟล์",
      logout: "ออกจากระบบ"
    },
    vi: { // Vietnam (Vietnamese)
      systemName: "Hệ thống Quản lý Nhân viên",
      notifications: "Thông báo",
      profile: "Hồ sơ",
      logout: "Đăng xuất"
    },
    'pt-PT': { // Portugal (Portuguese)
      systemName: "Sistema de Gestão de Funcionários",
      notifications: "Notificações",
      profile: "Perfil",
      logout: "Sair"
    }
  };

  // Get current language code
  const currentLangCode = languages.find(lang => lang.name === selectedLanguage)?.code || 'en';

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg p-4 flex justify-between items-center text-white">
      {/* Left Side: System Title */}
      <div className="text-2xl font-extrabold tracking-tight">
        {navbarTranslations[currentLangCode]?.systemName || "Staff Management System"}
      </div>

      {/* Right Side: Notifications, Language, and User Profile */}
      <div className="flex items-center space-x-6">
        {/* Notification Bell Icon */}
        <div className="relative" title={navbarTranslations[currentLangCode]?.notifications}>
          <FiBell size={24} className="cursor-pointer hover:text-gray-200 transition" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            2
          </span>
        </div>

        {/* Language Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            className="flex items-center space-x-2 hover:text-gray-200 transition focus:outline-none"
            aria-label="Language selector"
          >
            <img
              src={languages.find(lang => lang.name === selectedLanguage)?.flag}
              alt={`${selectedLanguage} Flag`}
              className="w-5 h-5"
            />
            <span>{selectedLanguage}</span>
            <FiChevronDown size={16} />
          </button>
          {isLanguageOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.name)}
                  className="flex items-center space-x-3 w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100 transition"
                >
                  <img
                    src={language.flag}
                    alt={`${language.name} Flag`}
                    className="w-5 h-5"
                  />
                  <span>{language.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserOpen(!isUserOpen)}
            className="flex items-center space-x-2 hover:text-gray-200 transition focus:outline-none"
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-800 font-semibold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">{userName}</span>
              <span className="text-xs text-gray-200">{userRole}</span>
            </div>
            <FiChevronDown size={16} />
          </button>
          {isUserOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
              <button
                onClick={handleProfileClick}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100 transition"
              >
                {navbarTranslations[currentLangCode]?.profile || "Profile"}
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-red-100 transition"
              >
                {navbarTranslations[currentLangCode]?.logout || "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;