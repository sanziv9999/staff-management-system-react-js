import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Sidebar({ onLogout, language = 'en' }) {
  const navigate = useNavigate();

  // Menu items in multiple languages
  const menuItems = {
    en: [
      { path: '/', name: 'Dashboard' },
      { path: '/staff', name: 'Staff' },
      { path: '/department', name: 'Department' },
      { path: '/schedule', name: 'Schedule' },
      { path: '/salary', name: 'Salary Details' },
      { path: '/attendance', name: 'Attendance' },
      { path: '/settings', name: 'Settings' },
    ],
    ja: [
      { path: '/', name: 'ダッシュボード' },
      { path: '/staff', name: 'スタッフ' },
      { path: '/department', name: '部門' },
      { path: '/schedule', name: 'スケジュール' },
      { path: '/salary', name: '給与明細' },
      { path: '/attendance', name: '勤怠管理' },
      { path: '/settings', name: '設定' },
    ],
    ne: [
      { path: '/', name: 'ड्यासबोर्ड' },
      { path: '/staff', name: 'कर्मचारी' },
      { path: '/department', name: 'विभाग' },
      { path: '/schedule', name: 'कार्य तालिका' },
      { path: '/salary', name: 'तलब विवरण' },
      { path: '/attendance', name: 'उपस्थिति' },
      { path: '/settings', name: 'सेटिङ्गहरू' },
    ],
    hi: [
      { path: '/', name: 'डैशबोर्ड' },
      { path: '/staff', name: 'कर्मचारी' },
      { path: '/department', name: 'विभाग' },
      { path: '/schedule', name: 'कार्यसूची' },
      { path: '/salary', name: 'वेतन विवरण' },
      { path: '/attendance', name: 'उपस्थिति' },
      { path: '/settings', name: 'सेटिंग्स' },
    ],
    my: [ // Myanmar (Burmese)
      { path: '/', name: 'ဒက်ရှ်ဘုတ်' },
      { path: '/staff', name: 'ဝန်ထမ်း' },
      { path: '/department', name: 'ဌာန' },
      { path: '/schedule', name: 'အချိန်ဇယား' },
      { path: '/salary', name: 'လစာအသေးစိတ်' },
      { path: '/attendance', name: 'တက်ရောက်မှု' },
      { path: '/settings', name: 'ဆက်တင်များ' },
    ],
    'pt-BR': [ // Brazil (Portuguese)
      { path: '/', name: 'Painel' },
      { path: '/staff', name: 'Funcionários' },
      { path: '/department', name: 'Departamento' },
      { path: '/schedule', name: 'Cronograma' },
      { path: '/salary', name: 'Detalhes do Salário' },
      { path: '/attendance', name: 'Presença' },
      { path: '/settings', name: 'Configurações' },
    ],
    tl: [ // Philippines (Filipino/Tagalog)
      { path: '/', name: 'Dashboard' },
      { path: '/staff', name: 'Kawani' },
      { path: '/department', name: 'Kagawaran' },
      { path: '/schedule', name: 'Iskedyul' },
      { path: '/salary', name: 'Detalye ng Sahod' },
      { path: '/attendance', name: 'Pagdalo' },
      { path: '/settings', name: 'Mga Setting' },
    ],
    bn: [ // Bangladesh (Bengali)
      { path: '/', name: 'ড্যাশবোর্ড' },
      { path: '/staff', name: 'কর্মী' },
      { path: '/department', name: 'বিভাগ' },
      { path: '/schedule', name: 'সময়সূচী' },
      { path: '/salary', name: 'বেতন বিবরণ' },
      { path: '/attendance', name: 'উপস্থিতি' },
      { path: '/settings', name: 'সেটিংস' },
    ],
    th: [ // Thailand (Thai)
      { path: '/', name: 'แดชบอร์ด' },
      { path: '/staff', name: 'พนักงาน' },
      { path: '/department', name: 'แผนก' },
      { path: '/schedule', name: 'ตารางงาน' },
      { path: '/salary', name: 'รายละเอียดเงินเดือน' },
      { path: '/attendance', name: 'การเข้างาน' },
      { path: '/settings', name: 'การตั้งค่า' },
    ],
    vi: [ // Vietnam (Vietnamese)
      { path: '/', name: 'Bảng Điều Khiển' },
      { path: '/staff', name: 'Nhân Viên' },
      { path: '/department', name: 'Phòng Ban' },
      { path: '/schedule', name: 'Lịch Trình' },
      { path: '/salary', name: 'Chi Tiết Lương' },
      { path: '/attendance', name: 'Điểm Danh' },
      { path: '/settings', name: 'Cài Đặt' },
    ],
    'pt-PT': [ // Portugal (Portuguese)
      { path: '/', name: 'Painel' },
      { path: '/staff', name: 'Funcionários' },
      { path: '/department', name: 'Departamento' },
      { path: '/schedule', name: 'Horário' },
      { path: '/salary', name: 'Detalhes do Salário' },
      { path: '/attendance', name: 'Presença' },
      { path: '/settings', name: 'Configurações' },
    ]
  };

  // Text for logout button
  const logoutText = {
    en: 'Logout',
    ja: 'ログアウト',
    ne: 'लगआउट',
    hi: 'लॉगआउट',
    my: 'ထွက်ရန်', // Myanmar (Burmese)
    'pt-BR': 'Sair', // Brazil (Portuguese)
    tl: 'Mag-logout', // Philippines (Filipino/Tagalog)
    bn: 'লগআউট', // Bangladesh (Bengali)
    th: 'ออกจากระบบ', // Thailand (Thai)
    vi: 'Đăng xuất', // Vietnam (Vietnamese)
    'pt-PT': 'Sair' // Portugal (Portuguese)
  };

  // Fallback to English if the language is not supported
  const currentMenuItems = menuItems[language] || menuItems['en'];
  const currentLogoutText = logoutText[language] || logoutText['en'];

  const handleLogout = () => {
    onLogout(); // Call the logout function passed from the parent
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="w-64 bg-white shadow-md h-full p-4 hidden md:block">
      <nav className="space-y-2">
        {currentMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block p-2 rounded ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`
            }
          >
            {item.name}
          </NavLink>
        ))}
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="block w-full text-left p-2 rounded hover:bg-red-100 text-red-600 mt-4"
        >
          {currentLogoutText}
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;