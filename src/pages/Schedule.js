import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import API_BASE_URL from '../api';

// Translation dictionary
const translations = {
  en: {
    title: "Schedule Management",
    searchStaff: "Search Staff...",
    noStaffFound: "No staff found",
    location: "Location",
    addSchedule: "Add Schedule",
    updateSchedule: "Update Schedule",
    selectStaffError: "Please select a staff member",
    locationError: "Please provide a location",
    searchPlaceholder: "Search by staff name, date, shift, or location...",
    staff: "Staff",
    date: "Date",
    shift: "Shift",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete schedule for",
    thisStaff: "this staff",
    loginError: "Please log in to access this page.",
    fetchError: "Failed to fetch data. Please ensure the backend server is running or check your login credentials.",
    addError: "Failed to add schedule",
    updateError: "Failed to update schedule",
    deleteError: "Failed to delete schedule",
    na: "N/A",
    shifts: {
      Morning: "Morning",
      Afternoon: "Afternoon",
      Night: "Night"
    }
  },
  ja: {
    title: "スケジュール管理",
    searchStaff: "スタッフを検索...",
    noStaffFound: "スタッフが見つかりません",
    location: "場所",
    addSchedule: "スケジュールを追加",
    updateSchedule: "スケジュールを更新",
    selectStaffError: "スタッフを選択してください",
    locationError: "場所を入力してください",
    searchPlaceholder: "スタッフ名、日付、シフト、または場所で検索...",
    staff: "スタッフ",
    date: "日付",
    shift: "シフト",
    actions: "操作",
    edit: "編集",
    delete: "削除",
    confirmDelete: "このスケジュールを削除してもよろしいですか",
    thisStaff: "このスタッフ",
    loginError: "このページにアクセスするにはログインしてください。",
    fetchError: "データの取得に失敗しました。バックエンドサーバーが実行されているか、ログイン資格情報を確認してください。",
    addError: "スケジュールの追加に失敗しました",
    updateError: "スケジュールの更新に失敗しました",
    deleteError: "スケジュールの削除に失敗しました",
    na: "なし",
    shifts: {
      Morning: "朝",
      Afternoon: "昼",
      Night: "夜"
    }
  }
};

function Schedule({ token }) {
  const [language, setLanguage] = useState('en');
  const [schedules, setSchedules] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [newSchedule, setNewSchedule] = useState({ staff: '', date: new Date(), shift: 'Morning', location: '' });
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [staffSearch, setStaffSearch] = useState('');
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [error, setError] = useState('');

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const t = (key) => translations[language][key] || key;

  // Fetch schedules and staff on component mount
  useEffect(() => {
    if (!token) {
      setError(t('loginError'));
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchData = async () => {
      try {
        const [scheduleResponse, staffResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/schedules/`),
          axios.get(`${API_BASE_URL}/staff/`)
        ]);
        setSchedules(scheduleResponse.data);
        setStaffList(staffResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error.response?.status, error.response?.data);
        setError(t('fetchError'));
      }
    };
    fetchData();
  }, [token, language]);

  // Helper function to get staff name from staff ID
  const getStaffName = (staffId) => {
    const staff = staffList.find(s => s.id === staffId);
    return staff ? (staff.name || `${staff.first_name || ''} ${staff.middle_name || ''} ${staff.last_name || ''}`.trim()) : t('na');
  };

  // Handle adding a new schedule
  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!newSchedule.staff) {
      setError(t('selectStaffError'));
      return;
    }
    if (!newSchedule.location) {
      setError(t('locationError'));
      return;
    }
    setError('');
    const payload = {
      staff_id: parseInt(newSchedule.staff),
      date: newSchedule.date.toISOString().split('T')[0],
      shift: newSchedule.shift,
      location: newSchedule.location
    };
    try {
      const response = await axios.post(`${API_BASE_URL}/schedules/`, payload);
      setSchedules([...schedules, response.data]);
      setNewSchedule({ staff: '', date: new Date(), shift: 'Morning', location: '' });
      setStaffSearch('');
      setShowStaffDropdown(false);
    } catch (error) {
      console.error('Error adding schedule:', error.response?.data || error.message);
      setError(t('addError') + ': ' + (error.response?.data?.detail || JSON.stringify(error.response?.data) || error.message));
    }
  };

  // Handle editing a schedule
  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    const staffId = typeof schedule.staff === 'object' ? schedule.staff?.id : schedule.staff;
    setNewSchedule({
      staff: staffId?.toString() || '',
      date: new Date(schedule.date),
      shift: schedule.shift || 'Morning',
      location: schedule.location || ''
    });
    setStaffSearch(typeof schedule.staff === 'object' ? schedule.staff?.name : getStaffName(schedule.staff) || '');
    setShowStaffDropdown(false);
  };

  // Handle updating a schedule
  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    if (!editingSchedule || !newSchedule.staff) {
      setError(t('selectStaffError'));
      return;
    }
    if (!newSchedule.location) {
      setError(t('locationError'));
      return;
    }
    setError('');
    const payload = {
      staff_id: parseInt(newSchedule.staff),
      date: newSchedule.date.toISOString().split('T')[0],
      shift: newSchedule.shift,
      location: newSchedule.location
    };
    try {
      const response = await axios.put(`${API_BASE_URL}/schedules/${editingSchedule.id}/`, payload);
      setSchedules(schedules.map(s => s.id === editingSchedule.id ? response.data : s));
      setEditingSchedule(null);
      setNewSchedule({ staff: '', date: new Date(), shift: 'Morning', location: '' });
      setStaffSearch('');
      setShowStaffDropdown(false);
    } catch (error) {
      console.error('Error updating schedule:', error.response?.data || error.message);
      setError(t('updateError') + ': ' + (error.response?.data?.detail || JSON.stringify(error.response?.data) || error.message));
    }
  };

  // Handle deleting a schedule
  const handleDeleteSchedule = async (id, staffName) => {
    const confirmed = window.confirm(`${t('confirmDelete')} ${staffName || t('thisStaff')}?`);
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/schedules/${id}/`);
        setSchedules(schedules.filter(schedule => schedule.id !== id));
      } catch (error) {
        console.error('Error deleting schedule:', error);
        setError(t('deleteError') + ': ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  // Handle form submission (add or update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSchedule) {
      handleUpdateSchedule(e);
    } else {
      handleAddSchedule(e);
    }
  };

  // Filter schedules based on search term
  const filteredSchedules = schedules.filter(schedule => {
    const staffName = typeof schedule.staff === 'object' ? schedule.staff?.name : getStaffName(schedule.staff) || '';
    const date = schedule.date || '';
    const shift = schedule.shift || '';
    const location = schedule.location || '';
    const search = searchTerm.toLowerCase();

    return (
      staffName.toLowerCase().includes(search) ||
      date.includes(search) ||
      shift.toLowerCase().includes(search) ||
      location.toLowerCase().includes(search)
    );
  });

  // Filter staff based on search input
  const filteredStaff = staffList.filter(staff => {
    const name = staff.name || `${staff.first_name || ''} ${staff.middle_name || ''} ${staff.last_name || ''}`.trim();
    return name.toLowerCase().includes(staffSearch.toLowerCase());
  });

  // Handle staff selection from dropdown
  const handleStaffSelect = (staff) => {
    setNewSchedule({ ...newSchedule, staff: staff.id.toString() });
    setStaffSearch(staff.name || `${staff.first_name || ''} ${staff.middle_name || ''} ${staff.last_name || ''}`.trim());
    setShowStaffDropdown(false);
  };

  if (!token) {
    return <p className="text-red-600">{t('loginError')}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
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
            />
            {showStaffDropdown && (
              <ul className="absolute z-10 bg-white border rounded shadow max-h-40 overflow-y-auto w-full">
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((staff) => (
                    <li
                      key={staff.id}
                      onClick={() => handleStaffSelect(staff)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {staff.name || `${staff.first_name || ''} ${staff.middle_name || ''} ${staff.last_name || ''}`.trim()}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">{t('noStaffFound')}</li>
                )}
              </ul>
            )}
          </div>
          <DatePicker
            selected={newSchedule.date}
            onChange={(date) => setNewSchedule({ ...newSchedule, date })}
            className="p-2 border rounded"
            dateFormat="yyyy-MM-dd"
          />
          <select
            value={newSchedule.shift}
            onChange={(e) => setNewSchedule({ ...newSchedule, shift: e.target.value })}
            className="p-2 border rounded"
          >
            {Object.entries(t('shifts')).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder={t('location')}
            value={newSchedule.location}
            onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editingSchedule ? t('updateSchedule') : t('addSchedule')}
        </button>
      </form>

      {/* Search Bar for Schedules */}
      <input
        type="text"
        placeholder={t('searchPlaceholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/3 p-2 border rounded mb-4"
      />

      {/* Schedule Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">{t('staff')}</th>
              <th className="p-2 text-left">{t('date')}</th>
              <th className="p-2 text-left">{t('shift')}</th>
              <th className="p-2 text-left">{t('location')}</th>
              <th className="p-2 text-left">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map((schedule) => (
              <tr key={schedule.id} className="border-t">
                <td className="p-2">{typeof schedule.staff === 'object' ? schedule.staff?.name : getStaffName(schedule.staff) || t('na')}</td>
                <td className="p-2">{schedule.date || t('na')}</td>
                <td className="p-2">{t('shifts')[schedule.shift] || schedule.shift || t('na')}</td>
                <td className="p-2">{schedule.location || t('na')}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEditSchedule(schedule)}
                    className="text-blue-600 mr-2 hover:underline"
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id, typeof schedule.staff === 'object' ? schedule.staff?.name : getStaffName(schedule.staff))}
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

export default Schedule;