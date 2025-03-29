import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API_BASE_URL from '../api';

// Translation dictionary
const translations = {
  en: {
    title: "Attendance Management",
    selectDate: "Select Date:",
    searchStaff: "Search Staff...",
    noStaffFound: "No staff found",
    status: "Status",
    present: "Present",
    absent: "Absent",
    leave: "Leave",
    timeIn: "Time In",
    timeOut: "Time Out",
    updateAttendance: "Update Attendance",
    recordAttendance: "Record Attendance",
    requiredFields: "Staff and status are required.",
    loading: "Loading attendance records...",
    noRecords: "No attendance records available for this date.",
    fetchError: "Failed to fetch data. Please ensure the backend server is running or check your login credentials.",
    addError: "Failed to add attendance",
    updateError: "Failed to update attendance",
    deleteError: "Failed to delete attendance",
    confirmDelete: "Are you sure you want to delete attendance for",
    unknown: "Unknown",
    staff: "Staff",
    date: "Date",
    actions: "Actions",
    na: "N/A"
  },
  ja: {
    title: "出勤管理",
    selectDate: "日付を選択:",
    searchStaff: "スタッフを検索...",
    noStaffFound: "スタッフが見つかりません",
    status: "状態",
    present: "出勤",
    absent: "欠勤",
    leave: "休暇",
    timeIn: "出勤時間",
    timeOut: "退勤時間",
    updateAttendance: "出勤記録を更新",
    recordAttendance: "出勤を記録",
    requiredFields: "スタッフと状態が必要です。",
    loading: "出勤記録を読み込み中...",
    noRecords: "この日付の出勤記録はありません。",
    fetchError: "データの取得に失敗しました。バックエンドサーバーが実行されているか、ログイン資格情報を確認してください。",
    addError: "出勤記録の追加に失敗しました",
    updateError: "出勤記録の更新に失敗しました",
    deleteError: "出勤記録の削除に失敗しました",
    confirmDelete: "この出勤記録を削除してもよろしいですか",
    unknown: "不明",
    staff: "スタッフ",
    date: "日付",
    actions: "操作",
    na: "なし"
  }
};

function Attendance({ token }) {
  const [language, setLanguage] = useState('en');
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

  const navigate = useNavigate();

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const t = (key) => translations[language][key] || key;

  useEffect(() => {
    if (!token) {
      navigate('/login');
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
        setAttendanceRecords(attendanceResponse.data || []);
        setStaffList(staffResponse.data || []);
        if (!attendanceResponse.data || attendanceResponse.data.length === 0) {
          setFetchError(t('noRecords'));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setFetchError(t('fetchError'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, selectedDate, navigate, language]);

  const handleAddAttendance = async (e) => {
    e.preventDefault();
    if (!newAttendance.staff || !newAttendance.status) {
      setError(t('requiredFields'));
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
    try {
      const response = await axios.post(`${API_BASE_URL}/attendance/`, payload);
      setAttendanceRecords([...attendanceRecords, response.data]);
      setNewAttendance({ staff: '', status: 'Present', time_in: '', time_out: '' });
      setStaffSearch('');
      setShowStaffDropdown(false);
      setFetchError('');
    } catch (error) {
      console.error('Error adding attendance:', error.response?.data || error.message);
      setError(t('addError') + ': ' + (error.response?.data?.detail || error.message));
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
      setError(t('requiredFields'));
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
      setError(t('updateError') + ': ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDeleteAttendance = async (id, staffName) => {
    const confirmed = window.confirm(`${t('confirmDelete')} ${staffName || t('unknown')}?`);
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/attendance/${id}/`);
        setAttendanceRecords(attendanceRecords.filter(record => record.id !== id));
      } catch (error) {
        console.error('Error deleting attendance:', error);
        setError(t('deleteError') + ': ' + (error.response?.data?.detail || error.message));
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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <label className="block mb-2 font-semibold">{t('selectDate')}</label>
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
                placeholder={t('searchStaff')}
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
                    <li className="p-2 text-gray-500">{t('noStaffFound')}</li>
                  )}
                </ul>
              )}
            </div>
            <select
              value={newAttendance.status}
              onChange={handleStatusChange}
              className="p-2 border rounded"
            >
              <option value="Present">{t('present')}</option>
              <option value="Absent">{t('absent')}</option>
              <option value="Leave">{t('leave')}</option>
            </select>
            {isTimeInputVisible && (
              <>
                <input
                  type="time"
                  value={newAttendance.time_in}
                  onChange={(e) => setNewAttendance({ ...newAttendance, time_in: e.target.value })}
                  className="p-2 border rounded"
                  placeholder={t('timeIn')}
                />
                <input
                  type="time"
                  value={newAttendance.time_out}
                  onChange={(e) => setNewAttendance({ ...newAttendance, time_out: e.target.value })}
                  className="p-2 border rounded"
                  placeholder={t('timeOut')}
                />
              </>
            )}
          </div>
          {error && <p className="text-red-600 mt-2">{error}</p>}
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {editingAttendance ? t('updateAttendance') : t('recordAttendance')}
          </button>
        </form>
      </div>
      {loading && <p className="text-gray-600 mb-4">{t('loading')}</p>}
      {fetchError && !loading && <p className="text-red-600 mb-4">{fetchError}</p>}
      {!loading && !fetchError && attendanceRecords.length === 0 && (
        <p className="text-gray-600 mb-4">{t('noRecords')}</p>
      )}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">{t('staff')}</th>
              <th className="p-2 text-left">{t('status')}</th>
              <th className="p-2 text-left">{t('timeIn')}</th>
              <th className="p-2 text-left">{t('timeOut')}</th>
              <th className="p-2 text-left">{t('date')}</th>
              <th className="p-2 text-left">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record) => (
              <tr key={record.id} className="border-t">
                <td className="p-2">{record.staff?.name || t('unknown')}</td>
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
                    {t(record.status.toLowerCase())}
                  </span>
                </td>
                <td className="p-2">{record.time_in || t('na')}</td>
                <td className="p-2">{record.time_out || t('na')}</td>
                <td className="p-2">{record.date}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEditAttendance(record)}
                    className="text-blue-600 mr-2 hover:underline"
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteAttendance(record.id, record.staff?.name || t('unknown'))}
                    className="text-red-600 hover:underline"
                  >
                    {t('delete')}
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