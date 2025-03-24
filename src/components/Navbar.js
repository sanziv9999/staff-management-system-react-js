import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiChevronDown } from 'react-icons/fi';

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Admin'; // Fallback to 'Admin' if not found
  const userRole = localStorage.getItem('is_staff') === 'true' ? 'Staff' : 'Admin'; // Determine role based on is_staff

  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = ['English', 'Japanese', 'Nepali', 'Hindi'];

  const handleLogout = () => {
    onLogout();
    localStorage.clear();
    navigate('/');
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setIsLanguageOpen(false);
    // Add logic here to handle language change (e.g., i18n integration)
  };

  const handleProfileClick = () => {
    navigate('/profile'); // Adjust the route as per your app's routing
    setIsUserOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg p-4 flex justify-between items-center text-white">
      {/* Left Side: System Title */}
      <div className="text-2xl font-extrabold tracking-tight">
        Staff Management System
      </div>

      {/* Right Side: Notifications, Language, and User Profile */}
      <div className="flex items-center space-x-6">
        {/* Notification Bell Icon */}
        <div className="relative">
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
          >
            <img
              src="https://flagcdn.com/16x12/gb.png"
              alt="Language Flag"
              className="w-5 h-5"
            />
            <span>{selectedLanguage}</span>
            <FiChevronDown size={16} />
          </button>
          {isLanguageOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
              {languages.map((language) => (
                <button
                  key={language}
                  onClick={() => handleLanguageSelect(language)}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100 transition"
                >
                  {language}
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
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
              <button
                onClick={handleProfileClick}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100 transition"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-red-100 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;