import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Sidebar({ onLogout, language = 'en' }) {
  const navigate = useNavigate();

  // Menu items in both languages
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
    ]
  };

  const handleLogout = () => {
    onLogout(); // Call the logout function passed from the parent
    navigate('/'); // Redirect to login page
  };

  // Text for logout button
  const logoutText = {
    en: 'Logout',
    ja: 'ログアウト'
  };

  return (
    <div className="w-64 bg-white shadow-md h-full p-4 hidden md:block">
      <nav className="space-y-2">
        {menuItems[language].map((item) => (
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
          {logoutText[language]}
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;