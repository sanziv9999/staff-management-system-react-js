import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from '../api';

function StaffLogin({ setToken, setIsStaff }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/staff/login/`, credentials);
      const { access, is_staff, department, staff_id, user_name } = response.data;
      localStorage.clear();
      setToken(access);
      setIsStaff(is_staff);
      localStorage.setItem('token', access);
      localStorage.setItem('is_staff', is_staff);
      localStorage.setItem('department', department);
      localStorage.setItem('staff_id', staff_id);
      localStorage.setItem('user_name', user_name);
      setError('');
      toast.success('Login successful!', { autoClose: 2000 });
      navigate('/staff-dashboard');
    } catch (error) {
      console.error('Staff login error:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.non_field_errors?.[0] || error.response?.data?.error || error.message;
      setError('Login failed: ' + errorMsg);
      toast.error('Login failed: ' + errorMsg, { autoClose: 3000 });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError('Please enter your email.');
      toast.error('Please enter your email.', { autoClose: 3000 });
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/staff/password_reset/`, { email: forgotEmail });
      setForgotMessage(response.data.message || 'Password reset link sent to your email.');
      setError('');
      toast.success(response.data.message || 'Password reset link sent to your email.', { autoClose: 2000 });
      setForgotEmail('');
      setTimeout(() => setShowForgotPassword(false), 2000);
    } catch (error) {
      console.error('Forgot password error:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.email?.[0] || error.response?.data?.detail || error.message;
      setError('Failed to send reset link: ' + errorMsg);
      toast.error('Failed to send reset link: ' + errorMsg, { autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          {showForgotPassword ? 'Reset Password' : 'Staff Login'}
        </h2>

        {/* Login Form */}
        {!showForgotPassword ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {error && <p className="text-red-500 text-center font-medium">{error}</p>}
            <button
              type="submit"
              className="w-full p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition font-semibold"
            >
              Login
            </button>
            <p className="text-center text-gray-600">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(true);
                  setError('');
                }}
                className="text-blue-600 hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </p>
          </form>
        ) : (
          /* Forgot Password Form */
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label htmlFor="forgot_email" className="block text-sm font-semibold text-gray-700 mb-1">
                Enter your email
              </label>
              <input
                type="email"
                id="forgot_email"
                placeholder="Email for password reset"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400"
                required
              />
            </div>
            {error && <p className="text-red-500 text-center font-medium">{error}</p>}
            {forgotMessage && <p className="text-green-500 text-center font-medium">{forgotMessage}</p>}
            <button
              type="submit"
              className="w-full p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition font-semibold"
            >
              Send Reset Link
            </button>
            <p className="text-center text-gray-600">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setError('');
                  setForgotMessage('');
                }}
                className="text-blue-600 hover:underline font-medium"
              >
                Back to Login
              </button>
            </p>
          </form>
        )}

        {/* Registration Link */}
        {!showForgotPassword && (
          <p className="text-center text-gray-600 mt-4">
            Don’t have an account?{' '}
            <a href="/staff-registration" className="text-blue-600 hover:underline font-medium">
              Register here
            </a>
          </p>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default StaffLogin;