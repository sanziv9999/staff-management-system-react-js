import React from 'react';

function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Staff Management System</h1>
        <div className="flex items-center space-x-4">
          <span>Welcome, Admin</span>
          <button className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;