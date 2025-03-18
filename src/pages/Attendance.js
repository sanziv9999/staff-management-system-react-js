import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API_BASE_URL from '../api';

function Attendance({ token }) {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newAttendance, setNewAttendance] = useState({
    staff: '',
    status: 'Present',
    time_in: '',
    time_out: '',
  });
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [staffSearch, setStaffSearch] = useState('');
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Redirect to login if no token is provided
    if (!token) {
      navigate('/login'); // Redirect to login page
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [attendanceResponse, staffResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/attendance/`, {
            params: { date: selectedDate.toISOString().split('T')[0] },
          }),
          axios.get(`${API_BASE_URL}/staff/`),
        ]);
        console.log('Attendance Response:', attendanceResponse.data);
        console.log('Staff List Response:', staffResponse.data);
        setAttendanceRecords(attendanceResponse.data || []);
        setStaffList(staffResponse.data || []);
        if (!attendanceResponse.data || attendanceResponse.data.length === 0) {
          setFetchError('No attendance records found for this date.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setFetchError('Failed to fetch data. Please ensure the backend server is running or check your login credentials.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, selectedDate, navigate]); // Added navigate to dependency array

  const handleAddAttendance = async (e) => {
    e.preventDefault();
    if (!newAttendance.staff || !newAttendance.status) {
      setError('Staff and status are required.');
      return;
    }
    setError('');
    const payload = {
      ...newAttendance,
      staff_id: parseInt(newAttendance.staff),
      date: selectedDate.toISOString().split('T')[0],
      time_in: newAttendance.status === 'Present' && newAttendance.time_in ? `${newAttendance.time_in}:00` : null,
      time_out: newAttendance.status === 'Present' && newAttendance.time_out ? `${newAttendance.time_out}:00` : null,
    };
    delete payload.staff;
    console.log('Adding attendance payload:', payload);
    try {
      const response = await axios.post(`${API_BASE_URL}/attendance/`, payload);
      setAttendanceRecords([...attendanceRecords, response.data]);
      setNewAttendance({ staff: '', status: 'Present', time_in: '', time_out: '' });
      setStaffSearch('');
      setShowStaffDropdown(false);
      setFetchError('');
    } catch (error) {
      console.error('Error adding attendance:', error.response?.data || error.message);
      setError('Failed to add attendance: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEditAttendance = (attendance) => {
    setEditingAttendance(attendance);
    setNewAttendance({
      staff: attendance.staff.id.toString(),
      status: attendance.status,
      time_in: attendance.time_in ? attendance.time_in.slice(0, 5) : '',
      time_out: attendance.time_out ? attendance.time_out.slice(0, 5) : '',
    });
    const staff = staffList.find(s => s.id === attendance.staff.id);
    setStaffSearch(staff ? staff.name : '');
    setShowStaffDropdown(false);
  };

  const handleUpdateAttendance = async (e) => {
    e.preventDefault();
    if (!editingAttendance) return;
    if (!newAttendance.staff || !newAttendance.status) {
      setError('Staff and status are required.');
      return;
    }
    setError('');
    const payload = {
      ...newAttendance,
      staff_id: parseInt(newAttendance.staff),
      date: selectedDate.toISOString().split('T')[0],
      time_in: newAttendance.status === 'Present' && newAttendance.time_in ? `${newAttendance.time_in}:00` : null,
      time_out: newAttendance.status === 'Present' && newAttendance.time_out ? `${newAttendance.time_out}:00` : null,
    };
    delete payload.staff;
    console.log('Updating attendance payload:', payload);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/attendance/${editingAttendance.id}/`,
        payload
      );
      setAttendanceRecords(attendanceRecords.map(a => a.id === editingAttendance.id ? response.data : a));
      setEditingAttendance(null);
      setNewAttendance({ staff: '', status: 'Present', time_in: '', time_out: '' });
      setStaffSearch('');
      setShowStaffDropdown(false);
    } catch (error) {
      console.error('Error updating attendance:', error.response?.data || error.message);
      setError('Failed to update attendance: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDeleteAttendance = async (id, staffName) => {
    const confirmed = window.confirm(`Are you sure you want to delete attendance for ${staffName}?`);
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/attendance/${id}/`);
        setAttendanceRecords(attendanceRecords.filter(record => record.id !== id));
      } catch (error) {
        console.error('Error deleting attendance:', error);
        setError('Failed to delete attendance: ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAttendance) {
      handleUpdateAttendance(e);
    } else {
      handleAddAttendance(e);
    }
  };

  const handleStaffSelect = (staff) => {
    setNewAttendance({ ...newAttendance, staff: staff.id.toString() });
    setStaffSearch(staff.name);
    setShowStaffDropdown(false);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setNewAttendance({
      ...newAttendance,
      status,
      time_in: status === 'Present' ? newAttendance.time_in : '',
      time_out: status === 'Present' ? newAttendance.time_out : '',
    });
  };

  const isTimeInputVisible = newAttendance.status === 'Present';

  // No need for the token check here since useEffect handles the redirect
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Attendance Management</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <label className="block mb-2 font-semibold">Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="p-2 border rounded w-full"
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow flex-1">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Staff..."
                value={staffSearch}
                onChange={(e) => {
                  setStaffSearch(e.target.value);
                  setShowStaffDropdown(true);
                }}
                onFocus={() => setShowStaffDropdown(true)}
                onBlur={() => setTimeout(() => setShowStaffDropdown(false), 200)}
                className="p-2 border rounded w-full"
                required
              />
              {showStaffDropdown && (
                <ul className="absolute z-10 bg-white border rounded shadow max-h-40 overflow-y-auto w-full">
                  {staffList
                    .filter(staff => staff.name.toLowerCase().includes(staffSearch.toLowerCase()))
                    .map((staff) => (
                      <li
                        key={staff.id}
                        onClick={() => handleStaffSelect(staff)}
                        onMouseDown={(e) => e.preventDefault()}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {staff.name} (ID: {staff.id})
                      </li>
                    ))}
                  {staffList.filter(staff => staff.name.toLowerCase().includes(staffSearch.toLowerCase())).length === 0 && (
                    <li className="p-2 text-gray-500">No staff found</li>
                  )}
                </ul>
              )}
            </div>
            <select
              value={newAttendance.status}
              onChange={handleStatusChange}
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
          </div>
          {error && <p className="text-red-600 mt-2">{error}</p>}
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {editingAttendance ? 'Update Attendance' : 'Record Attendance'}
          </button>
        </form>
      </div>
      {loading && <p className="text-gray-600 mb-4">Loading attendance records...</p>}
      {fetchError && !loading && <p className="text-red-600 mb-4">{fetchError}</p>}
      {!loading && !fetchError && attendanceRecords.length === 0 && (
        <p className="text-gray-600 mb-4">No attendance records available for this date.</p>
      )}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Staff</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Time In</th>
              <th className="p-2 text-left">Time Out</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record) => (
              <tr key={record.id} className="border-t">
                <td className="p-2">{record.staff?.name || 'Unknown'}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded ${
                      record.status === 'Present'
                        ? 'bg-green-200'
                        : record.status === 'Absent'
                        ? 'bg-red-200'
                        : 'bg-yellow-200'
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="p-2">{record.time_in || 'N/A'}</td>
                <td className="p-2">{record.time_out || 'N/A'}</td>
                <td className="p-2">{record.date}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEditAttendance(record)}
                    className="text-blue-600 mr-2 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAttendance(record.id, record.staff?.name || 'Unknown')}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attendance;