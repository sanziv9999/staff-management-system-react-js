import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../api';
import '../assets/css/dashboard.css';

function Dashboard({ token }) {
  const [stats, setStats] = useState({
    totalStaff: 0,
    departments: 0,
    presentToday: 0,
    totalSalary: 0,
  });
  const [currency, setCurrency] = useState('¥'); // Default currency symbol
  const [companyName, setCompanyName] = useState(''); // State for company name
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if no token is provided
    if (!token) {
      navigate('/login');
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchData = async () => {
      try {
        // Fetch settings to get the currency and company name
        const settingsRes = await axios.get(`${API_BASE_URL}/settings/1/`);
        const currencySymbol = settingsRes.data.currency.split('-')[1]; // Extract symbol (e.g., 'JPY-¥' -> '¥')
        setCurrency(currencySymbol);
        setCompanyName(settingsRes.data.company_name); // Set company name

        // Fetch dashboard stats
        const [staffRes, deptRes, attendanceRes, salaryRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/staff/`),
          axios.get(`${API_BASE_URL}/departments/`),
          axios.get(`${API_BASE_URL}/attendance/`, {
            params: { date: new Date().toISOString().split('T')[0] },
          }),
          axios.get(`${API_BASE_URL}/salaries/`),
        ]);

        setStats({
          totalStaff: staffRes.data.length,
          departments: deptRes.data.length,
          presentToday: attendanceRes.data.filter(a => a.status === 'Present').length,
          totalSalary: salaryRes.data.reduce(
            (sum, s) =>
              sum +
              (parseFloat(s.base_salary) || 0) +
              (parseFloat(s.bonus) || 0) -
              (parseFloat(s.deductions) || 0),
            0
          ),
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(
          'Failed to load dashboard data. Please ensure the backend server is running or check your login credentials.'
        );
      }
    };

    fetchData();
  }, [token, navigate]);

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="bg-blue-100 p-4 rounded shadow mb-6">
      <h1 className="text-3xl font-extrabold text-blue-800 animate-fadeIn">
        {companyName || 'Loading...'}
      </h1>
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Staff</h3>
          <p className="text-3xl">{stats.totalStaff}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Departments</h3>
          <p className="text-3xl">{stats.departments}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Present Today</h3>
          <p className="text-3xl">{stats.presentToday}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Monthly Salary</h3>
          <p className="text-3xl">
            {currency}{stats.totalSalary.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;