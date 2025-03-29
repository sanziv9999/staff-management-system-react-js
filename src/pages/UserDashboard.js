import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API_BASE_URL from '../api';

// Translation dictionary
const translations = {
  en: {
    dashboardTitle: "My Dashboard",
    markAttendance: "Mark Attendance",
    date: "Date",
    status: "Status",
    timeIn: "Time In",
    timeOut: "Time Out",
    present: "Present",
    absent: "Absent",
    leave: "Leave",
    submit: "Submit",
    attendanceHistory: "My Attendance History",
    noRecords: "No attendance records found.",
    noScheduleRecords: "No schedule records found.",
    noSalaryRecords: "No salary records found.",
    schedule: "My Schedule",
    shift: "Shift",
    location: "Location",
    salaryDetails: "My Salary Details",
    paymentDate: "Payment Date",
    baseSalary: "Base Salary",
    bonus: "Bonus",
    deductions: "Deductions",
    total: "Total",
    paid: "Paid",
    pending: "Pending"
  },
  ja: {
    dashboardTitle: "マイダッシュボード",
    markAttendance: "出勤記録",
    date: "日付",
    status: "状態",
    timeIn: "出勤時間",
    timeOut: "退勤時間",
    present: "出勤",
    absent: "欠勤",
    leave: "休暇",
    submit: "送信",
    attendanceHistory: "出勤履歴",
    noRecords: "出勤記録が見つかりません。",
    noScheduleRecords: "勤務予定が見つかりません。",
    noSalaryRecords: "給与記録が見つかりません。",
    schedule: "勤務予定",
    shift: "シフト",
    location: "場所",
    salaryDetails: "給与明細",
    paymentDate: "支払日",
    baseSalary: "基本給",
    bonus: "ボーナス",
    deductions: "控除額",
    total: "合計",
    paid: "支払済み",
    pending: "保留中"
  }
};

function UserDashboard({ token, isStaff }) {
  const [language, setLanguage] = useState('en');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [scheduleRecords, setScheduleRecords] = useState([]);
  const [newAttendance, setNewAttendance] = useState({
    date: new Date(),
    status: 'Present',
    time_in: '',
    time_out: '',
  });
  const [currency, setCurrency] = useState('$');
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');

  // Check localStorage for language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    const fetchData = async () => {
      const staffId = localStorage.getItem('staff_id');
      if (!staffId) {
        setFetchError(t('staffIdNotFound'));
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
        
        const currencySymbol = settingsResponse.data.currency.split('-')[1] || '$';
        setCurrency(currencySymbol);

        setAttendanceRecords(attendanceResponse.data || []);
        setSalaryRecords(salaryResponse.data || []);
        const sortedSchedules = (scheduleResponse.data || []).sort((a, b) => 
          new Date(a.date) - new Date(b.date)
        );
        setScheduleRecords(sortedSchedules);
        setFetchError('');
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
        setFetchError(
          t('fetchError') + (error.response?.data?.detail || error.response?.data?.message || error.message)
        );
      }
    };
    fetchData();
  }, [language]);

  const t = (key) => translations[language][key] || key;

  const getTodayClass = (recordDate) => {
    const today = new Date('2025-03-19');
    const recordDateObj = new Date(recordDate);
    return recordDateObj.toDateString() === today.toDateString()
      ? 'bg-blue-100 text-blue-800 font-semibold'
      : 'opacity-60';
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!newAttendance.status) {
      setError(t('statusRequired'));
      return;
    }
    setError('');
    const staffId = localStorage.getItem('staff_id');
    if (!staffId) {
      setError(t('staffIdNotFound'));
      return;
    }

    const payload = {
      staff_id: parseInt(staffId),
      date: newAttendance.date.toISOString().split('T')[0],
      status: newAttendance.status,
      time_in: newAttendance.status === 'Present' && newAttendance.time_in ? `${newAttendance.time_in}:00` : null,
      time_out: newAttendance.status === 'Present' && newAttendance.time_out ? `${newAttendance.time_out}:00` : null,
    };

    try {
      delete axios.defaults.headers.common['Authorization'];
      const response = await axios.post(`${API_BASE_URL}/attendance/`, payload);
      setAttendanceRecords([...attendanceRecords, response.data]);
      setNewAttendance({ date: new Date(), status: 'Present', time_in: '', time_out: '' });
      setFetchError('');
    } catch (error) {
      console.error('Error marking attendance:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
      setError(t('markAttendanceError') + errorMsg);
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
      <h2 className="text-2xl font-bold mb-4">{t('dashboardTitle')}</h2>

      {/* Mark Attendance Section */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">{t('markAttendance')}</h3>
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
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {t('submit')}
          </button>
        </form>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {/* Attendance History Section */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">{t('attendanceHistory')}</h3>
        {fetchError && <p className="text-red-600 mb-4">{fetchError}</p>}
        {attendanceRecords.length === 0 ? (
          <p className="text-gray-600">{t('noRecords')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">{t('date')}</th>
                  <th className="p-2 text-left">{t('status')}</th>
                  <th className="p-2 text-left">{t('timeIn')}</th>
                  <th className="p-2 text-left">{t('timeOut')}</th>
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
                        {t(record.status.toLowerCase())}
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
        <h3 className="text-lg font-semibold mb-2">{t('schedule')}</h3>
        {fetchError && <p className="text-red-600 mb-4">{fetchError}</p>}
        {scheduleRecords.length === 0 ? (
          <p className="text-gray-600">{t('noScheduleRecords')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">{t('date')}</th>
                  <th className="p-2 text-left">{t('shift')}</th>
                  <th className="p-2 text-left">{t('location')}</th>
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
        <h3 className="text-lg font-semibold mb-2">{t('salaryDetails')}</h3>
        {fetchError && <p className="text-red-600 mb-4">{fetchError}</p>}
        {salaryRecords.length === 0 ? (
          <p className="text-gray-600">{t('noSalaryRecords')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">{t('paymentDate')}</th>
                  <th className="p-2 text-left">{t('baseSalary')}</th>
                  <th className="p-2 text-left">{t('bonus')}</th>
                  <th className="p-2 text-left">{t('deductions')}</th>
                  <th className="p-2 text-left">{t('total')}</th>
                  <th className="p-2 text-left">{t('status')}</th>
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
                        {t(record.status.toLowerCase())}
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