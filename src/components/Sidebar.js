import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Sidebar({ onLogout }) {
  const navigate = useNavigate();

  const menuItems = [
    { path: '/', name: 'Dashboard' },
    { path: '/staff', name: 'Staff' },
    { path: '/department', name: 'Department' },
    { path: '/schedule', name: 'Schedule' },
    { path: '/salary', name: 'Salary Details' },
    { path: '/attendance', name: 'Attendance' },
    { path: '/settings', name: 'Settings' },
  ];

  const handleLogout = () => {
    onLogout(); // Call the logout function passed from the parent
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="w-64 bg-white shadow-md h-full p-4 hidden md:block">
      <nav className="space-y-2">
        {menuItems.map((item) => (
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
          Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;