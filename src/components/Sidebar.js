import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Sidebar({ onLogout, language = 'en' }) {
  const [isOpen, setIsOpen] = useState(false);
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

  const logoutText = {
    en: 'Logout',
    ja: 'ログアウト'
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsOpen(false);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 fixed top-4 left-4 z-50 bg-white rounded-md shadow-md"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md p-4 transform 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <nav className="space-y-2 mt-12 md:mt-0">
          {menuItems[language].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)} // Close sidebar on mobile click
              className={({ isActive }) =>
                `block p-2 rounded ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`
              }
            >
              {item.name}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="block w-full text-left p-2 rounded hover:bg-red-100 text-red-600 mt-4"
          >
            {logoutText[language]}
          </button>
        </nav>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

export default Sidebar;