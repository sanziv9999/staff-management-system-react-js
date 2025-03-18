// pages/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API_BASE_URL from '../api';

function UserDashboard({ token, isAdmin }) {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [newAttendance, setNewAttendance] = useState({
    date: new Date(),
    status: 'Present',
    time_in: '',
    time_out: '',
  });
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Please log in to access this page.');
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchData = async () => {
      try {
        const [attendanceResponse, salaryResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/attendance/`),
          axios.get(`${API_BASE_URL}/salaries/`),
        ]);
        setAttendanceRecords(attendanceResponse.data || []);
        setSalaryRecords(salaryResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setFetchError('Failed to fetch data. Please ensure the backend server is running or check your login credentials.');
      }
    };
    fetchData();
  }, [token]);

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!newAttendance.status) {
      setError('Status is required.');
      return;
    }
    setError('');
    const payload = {
      staff_id: attendanceRecords[0]?.staff.id, // Use the staff ID from the user's own record
      date: newAttendance.date.toISOString().split('T')[0],
      status: newAttendance.status,
      time_in: newAttendance.status === 'Present' && newAttendance.time_in ? `${newAttendance.time_in}:00` : null,
      time_out: newAttendance.status === 'Present' && newAttendance.time_out ? `${newAttendance.time_out}:00` : null,
    };
    try {
      const response = await axios.post(`${API_BASE_URL}/attendance/`, payload);
      setAttendanceRecords([...attendanceRecords, response.data]);
      setNewAttendance({ date: new Date(), status: 'Present', time_in: '', time_out: '' });
      setFetchError('');
    } catch (error) {
      console.error('Error marking attendance:', error.response?.data || error.message);
      setError('Failed to mark attendance: ' + (error.response?.data?.detail || error.message));
    }
  };

  const isTimeInputVisible = newAttendance.status === 'Present';

  if (!token) {
    return <p className="text-red-600">Please log in to access this page.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Dashboard</h2>

      {/* Mark Attendance Section */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Mark Attendance</h3>
        <form onSubmit={handleMarkAttendance} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DatePicker
            selected={newAttendance.date}
            onChange={(date) => setNewAttendance({ ...newAttendance, date })}
            className="p-2 border rounded w-full"
            dateFormat="yyyy-MM-dd"
          />
          <select
            value={newAttendance.status}
            onChange={(e) => setNewAttendance({ ...newAttendance, status: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
          </select>
          {isTimeInputVisible && (
            <>
              <input
                type="time"
                value={newAttendance.time_in}
                onChange={(e) => setNewAttendance({ ...newAttendance, time_in: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                type="time"
                value={newAttendance.time_out}
                onChange={(e) => setNewAttendance({ ...newAttendance, time_out: e.target.value })}
                className="p-2 border rounded"
              />
            </>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Mark Attendance
          </button>
        </form>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {/* Attendance History Section */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">My Attendance History</h3>
        {fetchError && <p className="text-red-600 mb-4">{fetchError}</p>}
        {attendanceRecords.length === 0 ? (
          <p className="text-gray-600">No attendance records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Time In</th>
                  <th className="p-2 text-left">Time Out</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <tr key={record.id} className="border-t">
                    <td className="p-2">{record.date}</td>
                    <td className="p-2">{record.status}</td>
                    <td className="p-2">{record.time_in || 'N/A'}</td>
                    <td className="p-2">{record.time_out || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Salary Details Section */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">My Salary Details</h3>
        {fetchError && <p className="text-red-600 mb-4">{fetchError}</p>}
        {salaryRecords.length === 0 ? (
          <p className="text-gray-600">No salary records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Payment Date</th>
                  <th className="p-2 text-left">Base Salary</th>
                  <th className="p-2 text-left">Bonus</th>
                  <th className="p-2 text-left">Deductions</th>
                  <th className="p-2 text-left">Total</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {salaryRecords.map((record) => (
                  <tr key={record.id} className="border-t">
                    <td className="p-2">{record.payment_date}</td>
                    <td className="p-2">${parseFloat(record.base_salary).toFixed(2)}</td>
                    <td className="p-2">${parseFloat(record.bonus).toFixed(2)}</td>
                    <td className="p-2">${parseFloat(record.deductions).toFixed(2)}</td>
                    <td className="p-2">
                      ${(parseFloat(record.base_salary) + parseFloat(record.bonus) - parseFloat(record.deductions)).toFixed(2)}
                    </td>
                    <td className="p-2">{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;