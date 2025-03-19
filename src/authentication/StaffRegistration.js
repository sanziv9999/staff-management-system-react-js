import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import API_BASE_URL from '../api';

function StaffRegistration({ setToken, setIsStaff }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: ''
  });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/departments/`); // Adjust endpoint as needed
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        setError('Failed to load departments');
      }
    };
    fetchDepartments();
  }, []);

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/staff/register/`, formData);
      const { access, is_staff, department } = response.data;
      setToken(access);
      setIsStaff(is_staff);
      localStorage.setItem('token', access);
      localStorage.setItem('is_staff', is_staff);
      localStorage.setItem('department', department);
      setError('');
      setSuccess('Registration successful! Logging you in...');
      setTimeout(() => navigate('/staff-dashboard'), 1500); // Redirect after 1.5s
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setError('Registration failed: ' + (error.response?.data?.email?.[0] || error.response?.data?.message || error.message));
      setSuccess('');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Staff Registration</h2>
        <form onSubmit={handleRegistration}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
          <div className="mb-6">
            <label htmlFor="department" className="block text-gray-700 font-medium mb-2">
              Department
            </label>
            <select
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
          {success && <p className="text-green-600 mb-4 text-center">{success}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/staff-login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default StaffRegistration;