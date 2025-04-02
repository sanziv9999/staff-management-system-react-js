import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Using react-icons for hamburger and close icons

function Sidebar({ onLogout, language = 'en' }) {
  const [isOpen, setIsOpen] = useState(false);
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
    my: [
      { path: '/', name: 'ဒက်ရှ်ဘုတ်' },
      { path: '/staff', name: 'ဝန်ထမ်း' },
      { path: '/department', name: 'ဌာန' },
      { path: '/schedule', name: 'အချိန်ဇယား' },
      { path: '/salary', name: 'လစာအသေးစိတ်' },
      { path: '/attendance', name: 'တက်ရောက်မှု' },
      { path: '/settings', name: 'ဆက်တင်များ' },
    ],
    'pt-BR': [
      { path: '/', name: 'Painel' },
      { path: '/staff', name: 'Funcionários' },
      { path: '/department', name: 'Departamento' },
      { path: '/schedule', name: 'Cronograma' },
      { path: '/salary', name: 'Detalhes do Salário' },
      { path: '/attendance', name: 'Presença' },
      { path: '/settings', name: 'Configurações' },
    ],
    tl: [
      { path: '/', name: 'Dashboard' },
      { path: '/staff', name: 'Kawani' },
      { path: '/department', name: 'Kagawaran' },
      { path: '/schedule', name: 'Iskedyul' },
      { path: '/salary', name: 'Detalye ng Sahod' },
      { path: '/attendance', name: 'Pagdalo' },
      { path: '/settings', name: 'Mga Setting' },
    ],
    bn: [
      { path: '/', name: 'ড্যাশবোর্ড' },
      { path: '/staff', name: 'কর্মী' },
      { path: '/department', name: 'বিভাগ' },
      { path: '/schedule', name: 'সময়সূচী' },
      { path: '/salary', name: 'বেতন বিবরণ' },
      { path: '/attendance', name: 'উপস্থিতি' },
      { path: '/settings', name: 'সেটিংস' },
    ],
    th: [
      { path: '/', name: 'แดชบอร์ด' },
      { path: '/staff', name: 'พนักงาน' },
      { path: '/department', name: 'แผนก' },
      { path: '/schedule', name: 'ตารางงาน' },
      { path: '/salary', name: 'รายละเอียดเงินเดือน' },
      { path: '/attendance', name: 'การเข้างาน' },
      { path: '/settings', name: 'การตั้งค่า' },
    ],
    vi: [
      { path: '/', name: 'Bảng Điều Khiển' },
      { path: '/staff', name: 'Nhân Viên' },
      { path: '/department', name: 'Phòng Ban' },
      { path: '/schedule', name: 'Lịch Trình' },
      { path: '/salary', name: 'Chi Tiết Lương' },
      { path: '/attendance', name: 'Điểm Danh' },
      { path: '/settings', name: 'Cài Đặt' },
    ],
    'pt-PT': [
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
    my: 'ထွက်ရန်',
    'pt-BR': 'Sair',
    tl: 'Mag-logout',
    bn: 'লগআউট',
    th: 'ออกจากระบบ',
    vi: 'Đăng xuất',
    'pt-PT': 'Sair'
  };

  // Fallback to English if the language is not supported
  const currentMenuItems = menuItems[language] || menuItems['en'];
  const currentLogoutText = logoutText[language] || logoutText['en'];

  const handleLogout = () => {
    onLogout(); // Call the logout function passed from the parent
    navigate('/'); // Redirect to login page
    setIsOpen(false); // Close the sidebar on logout
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="bg-white p-2 rounded-md shadow-md focus:outline-none"
        >
          {isOpen ? (
            <FaTimes className="w-6 h-6 text-gray-800" />
          ) : (
            <FaBars className="w-6 h-6 text-gray-800" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md p-4 transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:h-full md:block`}
      >
        <nav className="space-y-2">
          {currentMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block p-2 rounded ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`
              }
              onClick={() => setIsOpen(false)} // Close sidebar on link click (mobile)
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

      {/* Overlay for Mobile (when sidebar is open) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar} // Close sidebar when clicking outside
        />
      )}
    </>
  );
}

export default Sidebar;