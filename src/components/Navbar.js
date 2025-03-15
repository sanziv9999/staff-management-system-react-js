import React from 'react';
import {  useNavigate } from 'react-router-dom';

function Navbar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 shadow-md p-4 flex justify-between items-center text-white">
      <div className="text-xl font-bold">Staff Management System</div>
      
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;