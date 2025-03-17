import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios';

function Dashboard({ token }) {
  const [stats, setStats] = useState({
    totalStaff: 0,
    departments: 0,
    presentToday: 0,
    totalSalary: 0,
  });
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Redirect to login if no token is provided
    if (!token) {
      navigate('/login'); // Redirect to login page
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchStats = async () => {
      try {
        const [staffRes, deptRes, attendanceRes, salaryRes] = await Promise.all([
          axios.get('http://localhost:8000/api/staff/'),
          axios.get('http://localhost:8000/api/departments/'),
          axios.get('http://localhost:8000/api/attendance/', {
            params: { date: new Date().toISOString().split('T')[0] },
          }),
          axios.get('http://localhost:8000/api/salaries/'),
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
        console.error('Error fetching stats:', error);
        setError(
          'Failed to load dashboard stats. Please ensure the backend server is running or check your login credentials.'
        );
      }
    };
    fetchStats();
  }, [token, navigate]); // Added navigate to dependency array

  // No need for token check here since useEffect handles the redirect
  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
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
          <p className="text-3xl">${stats.totalSalary.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;