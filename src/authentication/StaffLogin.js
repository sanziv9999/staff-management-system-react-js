import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import API_BASE_URL from '../api'; // Ensure this points to your API base URL

function StaffLogin({ setToken, setIsStaff }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/staff/login/`, credentials);
      const { access, is_staff, department, staff_id, user_name} = response.data;
      // Clear old localStorage data
      localStorage.clear();
      // Set new values
      setToken(access);
      setIsStaff(is_staff);
      localStorage.setItem('token', access);
      localStorage.setItem('is_staff', is_staff);
      localStorage.setItem('department', department);
      localStorage.setItem('staff_id', staff_id);
      localStorage.setItem('user_name', user_name);
      setError('');
      navigate('/staff-dashboard');
    } catch (error) {
      console.error('Staff login error:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.non_field_errors?.[0] || error.response?.data?.error || error.message;
      setError('Login failed: ' + errorMsg);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Staff Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-12 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <a href="/staff-registration" className="text-blue-600 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

export default StaffLogin;