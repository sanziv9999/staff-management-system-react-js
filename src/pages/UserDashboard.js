import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API_BASE_URL from '../api';

function UserDashboard({ token, isStaff }) {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [scheduleRecords, setScheduleRecords] = useState([]);
  const [newAttendance, setNewAttendance] = useState({
    date: new Date(),
    status: 'Present',
    time_in: '',
    time_out: '',
  });
  const [currency, setCurrency] = useState('$'); // Default currency symbol
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');

  const getTodayClass = (recordDate) => {
    const today = new Date('2025-03-19'); // Using the date you provided
    const recordDateObj = new Date(recordDate);
    return recordDateObj.toDateString() === today.toDateString()
      ? 'bg-blue-100 text-blue-800 font-semibold' // Highlighted style for today
      : 'opacity-60'; // Dimmed style for other days
  };

  useEffect(() => {
    const fetchData = async () => {
      const staffId = localStorage.getItem('staff_id');
      if (!staffId) {
        setFetchError('Staff ID not found. Please log in again.');
        return;
      }

      try {
        delete axios.defaults.headers.common['Authorization'];
        const [settingsResponse, attendanceResponse, salaryResponse, scheduleResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/settings/1/`),
          axios.get(`${API_BASE_URL}/attendance/`, { params: { staff_id: staffId } }),
          axios.get(`${API_BASE_URL}/salaries/`, { params: { staff_id: staffId } }),
          axios.get(`${API_BASE_URL}/schedules/`, { params: { staff_id: staffId } }),
        ]);
        
        // Set currency symbol from settings
        const currencySymbol = settingsResponse.data.currency.split('-')[1] || '$';
        setCurrency(currencySymbol);

        setAttendanceRecords(attendanceResponse.data || []);
        setSalaryRecords(salaryResponse.data || []);
        // Sort schedule records by date in ascending order
        const sortedSchedules = (scheduleResponse.data || []).sort((a, b) => 
          new Date(a.date) - new Date(b.date)
        );
        setScheduleRecords(sortedSchedules);
        setFetchError('');
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
        setFetchError(
          'Failed to fetch data: ' + (error.response?.data?.detail || error.response?.data?.message || error.message)
        );
      }
    };
    fetchData();
  }, []);

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!newAttendance.status) {
      setError('Status is required.');
      return;
    }
    setError('');
    const staffId = localStorage.getItem('staff_id');
    if (!staffId) {
      setError('Staff ID not found. Please log in again.');
      return;
    }

    const payload = {
      staff_id: parseInt(staffId),
      date: newAttendance.date.toISOString().split('T')[0],
      status: newAttendance.status,
      time_in: newAttendance.status === 'Present' && newAttendance.time_in ? `${newAttendance.time_in}:00` : null,
      time_out: newAttendance.status === 'Present' && newAttendance.time_out ? `${newAttendance.time_out}:00` : null,
    };

    console.log('Sending payload:', payload);

    try {
      delete axios.defaults.headers.common['Authorization'];
      const response = await axios.post(`${API_BASE_URL}/attendance/`, payload);
      setAttendanceRecords([...attendanceRecords, response.data]);
      setNewAttendance({ date: new Date(), status: 'Present', time_in: '', time_out: '' });
      setFetchError('');
    } catch (error) {
      console.error('Error marking attendance:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
      setError('Failed to mark attendance: ' + errorMsg);
    }
  };

  const isTimeInputVisible = newAttendance.status === 'Present';

  const getAttendanceStatusClass = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800';
      case 'Absent':
        return 'bg-red-100 text-red-800';
      case 'Leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSalaryStatusClass = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
                  <tr 
                    key={record.id} 
                    className={`border-t ${getTodayClass(record.date)}`}
                  >
                    <td className="p-2">{record.date}</td>
                    <td className="p-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${getAttendanceStatusClass(record.status)}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="p-2">{record.time_in || 'N/A'}</td>
                    <td className="p-2">{record.time_out || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schedule Details Section */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">My Schedule</h3>
        {fetchError && <p className="text-red-600 mb-4">{fetchError}</p>}
        {scheduleRecords.length === 0 ? (
          <p className="text-gray-600">No schedule records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Shift</th>
                  <th className="p-2 text-left">Location</th>
                </tr>
              </thead>
              <tbody>
                {scheduleRecords.map((record) => (
                  <tr 
                    key={record.id} 
                    className={`border-t ${getTodayClass(record.date)}`}
                  >
                    <td className="p-2">{record.date}</td>
                    <td className="p-2">{record.shift}</td>
                    <td className="p-2">{record.location}</td>
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
                    <td className="p-2">{currency}{parseFloat(record.base_salary).toFixed(2)}</td>
                    <td className="p-2">{currency}{parseFloat(record.bonus).toFixed(2)}</td>
                    <td className="p-2">{currency}{parseFloat(record.deductions).toFixed(2)}</td>
                    <td className="p-2">
                      {currency}{(parseFloat(record.base_salary) + parseFloat(record.bonus) - parseFloat(record.deductions)).toFixed(2)}
                    </td>
                    <td className="p-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${getSalaryStatusClass(record.status)}`}
                      >
                        {record.status}
                      </span>
                    </td>
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