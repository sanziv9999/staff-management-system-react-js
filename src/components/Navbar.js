import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Admin'; // Fallback to 'User' if not found

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 shadow-md p-4 flex justify-between items-center text-white">
      <div className="text-xl font-bold">Staff Management System</div>
      <div className="flex items-center space-x-4">
        <span className="text-white">Welcome, {userName}</span>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;