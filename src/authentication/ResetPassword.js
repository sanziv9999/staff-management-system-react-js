import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api';

function ResetPassword() {
  const [formData, setFormData] = useState({ new_password: '', confirm_password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/staff/password_reset/confirm/`, {
        token,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => navigate('/staff-login'), 2000);
    } catch (error) {
      console.error('Reset password error:', error.response?.data || error.message);
      setError(error.response?.data?.detail || 'Failed to reset password.');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="new_password" className="block text-sm font-semibold text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="new_password"
              name="new_password"
              placeholder="Enter new password"
              value={formData.new_password}
              onChange={handleChange}
              className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400"
              required
            />
          </div>
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-semibold text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              placeholder="Confirm new password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400"
              required
            />
          </div>
          {error && <p className="text-red-500 text-center font-medium">{error}</p>}
          {message && <p className="text-green-500 text-center font-medium">{message}</p>}
          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition font-semibold"
          >
            Reset Password
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Back to{' '}
          <a href="/staff-login" className="text-blue-600 hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;