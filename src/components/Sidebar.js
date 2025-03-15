import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  const menuItems = [
    { path: '/', name: 'Dashboard' },
    { path: '/staff', name: 'Staff' },
    { path: '/department', name: 'Department' },
    { path: '/schedule', name: 'Schedule' },
    { path: '/salary', name: 'Salary Details' },
    { path: '/attendance', name: 'Attendance' },
    { path: '/settings', name: 'Settings' },
  ];

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
      </nav>
    </div>
  );
}

export default Sidebar;