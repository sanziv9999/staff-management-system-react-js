import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';

// Translation dictionary
const translations = {
  en: {
    title: "Salary Details",
    searchStaff: "Search Staff...",
    noStaffFound: "No staff found",
    baseSalary: "Base Salary",
    bonus: "Bonus",
    deductions: "Deductions",
    paymentDate: "Payment Date",
    status: "Status",
    pending: "Pending",
    paid: "Paid",
    netSalary: "Net Salary",
    addSalary: "Add Salary",
    updateSalary: "Update Salary",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete salary for",
    unknown: "Unknown",
    loginError: "Please log in to access this page.",
    fetchError: "Failed to fetch salaries. Please ensure the backend server is running.",
    addError: "Failed to add salary",
    updateError: "Failed to update salary",
    deleteError: "Failed to delete salary",
    loading: "Loading salaries...",
    noSalaries: "No salaries available. Add a new salary to get started.",
    searchPlaceholder: "Search by name or ID...",
    requiredFields: "All fields are required, and salary values must be valid numbers",
    staff: "Staff",
    date: "Date",
    actions: "Actions"
  },
  ja: {
    title: "給与明細",
    searchStaff: "スタッフを検索...",
    noStaffFound: "スタッフが見つかりません",
    baseSalary: "基本給",
    bonus: "ボーナス",
    deductions: "控除額",
    paymentDate: "支払日",
    status: "状態",
    pending: "保留中",
    paid: "支払済み",
    netSalary: "手取り額",
    addSalary: "給与を追加",
    updateSalary: "給与を更新",
    edit: "編集",
    delete: "削除",
    confirmDelete: "この給与を削除してもよろしいですか",
    unknown: "不明",
    loginError: "このページにアクセスするにはログインしてください。",
    fetchError: "給与データの取得に失敗しました。バックエンドサーバーが実行されていることを確認してください。",
    addError: "給与の追加に失敗しました",
    updateError: "給与の更新に失敗しました",
    deleteError: "給与の削除に失敗しました",
    loading: "給与データを読み込み中...",
    noSalaries: "給与データがありません。新しい給与を追加してください。",
    searchPlaceholder: "名前またはIDで検索...",
    requiredFields: "すべてのフィールドが必要であり、給与の値は有効な数字でなければなりません",
    staff: "スタッフ",
    date: "日付",
    actions: "操作"
  }
};

function SalaryDetails({ token }) {
  const [language, setLanguage] = useState('en');
  const [salaries, setSalaries] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [newSalary, setNewSalary] = useState({
    staff: '',
    base_salary: '',
    bonus: '',
    deductions: '',
    payment_date: new Date().toISOString().split('T')[0],
    status: 'Pending',
  });
  const [currency, setCurrency] = useState('¥');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSalary, setEditingSalary] = useState(null);
  const [staffSearch, setStaffSearch] = useState('');
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [loading, setLoading] = useState(true);

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const t = (key) => translations[language][key] || key;

  useEffect(() => {
    if (!token) {
      setError(t('loginError'));
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchData = async () => {
      setLoading(true);
      try {
        const settingsRes = await axios.get(`${API_BASE_URL}/settings/1/`);
        const currencySymbol = settingsRes.data.currency.split('-')[1] || '¥';
        setCurrency(currencySymbol);
        const [salariesResponse, staffResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/salaries/`),
          axios.get(`${API_BASE_URL}/staff/`),
        ]);
        setSalaries(salariesResponse.data || []);
        setStaffList(staffResponse.data || []);
        if (!salariesResponse.data || salariesResponse.data.length === 0) {
          setFetchError(t('noSalaries'));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setFetchError(t('fetchError'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, language]);

  const calculateNetSalary = (salary) => {
    const base = parseFloat(salary.base_salary) || 0;
    const bonus = parseFloat(salary.bonus) || 0;
    const deductions = parseFloat(salary.deductions) || 0;
    return (base + bonus - deductions).toFixed(2);
  };

  const handleAddSalary = async (e) => {
    e.preventDefault();
    const baseSalary = parseFloat(newSalary.base_salary);
    const bonus = parseFloat(newSalary.bonus);
    const deductions = parseFloat(newSalary.deductions);
    if (!newSalary.staff || isNaN(baseSalary) || isNaN(bonus) || isNaN(deductions)) {
      setError(t('requiredFields'));
      return;
    }
    setError('');
    try {
      const payload = {
        staff_id: parseInt(newSalary.staff),
        base_salary: baseSalary,
        bonus,
        deductions,
        payment_date: newSalary.payment_date,
        status: newSalary.status,
      };
      const response = await axios.post(`${API_BASE_URL}/salaries/`, payload);
      setSalaries([...salaries, response.data]);
      setNewSalary({
        staff: '',
        base_salary: '',
        bonus: '',
        deductions: '',
        payment_date: new Date().toISOString().split('T')[0],
        status: 'Pending',
      });
      setStaffSearch('');
      setShowStaffDropdown(false);
      setFetchError('');
    } catch (error) {
      console.error('Error adding salary:', error.response?.data || error.message);
      setError(t('addError') + ': ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEditSalary = (salary) => {
    setEditingSalary(salary);
    const staffId = salary.staff && salary.staff.id ? salary.staff.id.toString() : '';
    setNewSalary({
      staff: staffId,
      base_salary: salary.base_salary ? salary.base_salary.toString() : '',
      bonus: salary.bonus ? salary.bonus.toString() : '',
      deductions: salary.deductions ? salary.deductions.toString() : '',
      payment_date: salary.payment_date || new Date().toISOString().split('T')[0],
      status: salary.status || 'Pending',
    });
    const staff = staffList.find(s => s.id === (salary.staff?.id || 0));
    setStaffSearch(staff ? staff.name : '');
    setShowStaffDropdown(false);
  };

  const handleUpdateSalary = async (e) => {
    e.preventDefault();
    if (!editingSalary) return;
    const baseSalary = parseFloat(newSalary.base_salary);
    const bonus = parseFloat(newSalary.bonus);
    const deductions = parseFloat(newSalary.deductions);
    if (!newSalary.staff || isNaN(baseSalary) || isNaN(bonus) || isNaN(deductions)) {
      setError(t('requiredFields'));
      return;
    }
    setError('');
    try {
      const payload = {
        staff_id: parseInt(newSalary.staff),
        base_salary: baseSalary,
        bonus,
        deductions,
        payment_date: newSalary.payment_date,
        status: newSalary.status,
      };
      const response = await axios.put(`${API_BASE_URL}/salaries/${editingSalary.id}/`, payload);
      setSalaries(salaries.map(s => s.id === editingSalary.id ? response.data : s));
      setEditingSalary(null);
      setNewSalary({
        staff: '',
        base_salary: '',
        bonus: '',
        deductions: '',
        payment_date: new Date().toISOString().split('T')[0],
        status: 'Pending',
      });
      setStaffSearch('');
      setShowStaffDropdown(false);
    } catch (error) {
      console.error('Error updating salary:', error.response?.data || error.message);
      setError(t('updateError') + ': ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDeleteSalary = async (id, staffName) => {
    const confirmed = window.confirm(`${t('confirmDelete')} ${staffName || t('unknown')}?`);
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/salaries/${id}/`);
        setSalaries(salaries.filter(salary => salary.id !== id));
      } catch (error) {
        console.error('Error deleting salary:', error);
        setError(t('deleteError') + ': ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSalary) {
      handleUpdateSalary(e);
    } else {
      handleAddSalary(e);
    }
  };

  const filteredSalaries = salaries.filter(salary => {
    if (!salary.staff) return false;
    const staffName = salary.staff.name || '';
    const staffId = salary.staff.id ? salary.staff.id.toString() : '';
    return (
      staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffId.includes(searchTerm)
    );
  });

  const handleStaffSelect = (staff) => {
    setNewSalary({ ...newSalary, staff: staff.id.toString() });
    setStaffSearch(staff.name);
    setShowStaffDropdown(false);
  };

  const handleNumberChange = (field) => (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setNewSalary({ ...newSalary, [field]: value });
      setError('');
    } else {
      setError(`${field.replace('_', ' ')} must be a valid number`);
    }
  };

  const handleStatusChange = (e) => {
    setNewSalary({ ...newSalary, status: e.target.value });
  };

  if (!token) {
    return <p className="text-red-600">{t('loginError')}</p>;
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="relative">
            <input
              type="text"
              placeholder={t('baseSalary')}
              value={newSalary.base_salary}
              onChange={handleNumberChange('base_salary')}
              className="p-2 border rounded w-full pl-8"
              required
            />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">{currency}</span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder={t('bonus')}
              value={newSalary.bonus}
              onChange={handleNumberChange('bonus')}
              className="p-2 border rounded w-full pl-8"
              required
            />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">{currency}</span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder={t('deductions')}
              value={newSalary.deductions}
              onChange={handleNumberChange('deductions')}
              className="p-2 border rounded w-full pl-8"
              required
            />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">{currency}</span>
          </div>
          <select
            value={newSalary.status}
            onChange={handleStatusChange}
            className="p-2 border rounded"
            required
          >
            <option value="Pending">{t('pending')}</option>
            <option value="Paid">{t('paid')}</option>
          </select>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editingSalary ? t('updateSalary') : t('addSalary')}
        </button>
      </form>
      {loading && <p className="text-gray-600 mb-4">{t('loading')}</p>}
      {fetchError && !loading && <p className="text-red-600 mb-4">{fetchError}</p>}
      {!loading && !fetchError && filteredSalaries.length === 0 && (
        <p className="text-gray-600 mb-4">{t('noSalaries')}</p>
      )}
      <input
        type="text"
        placeholder={t('searchPlaceholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/3 p-2 border rounded mb-4"
      />
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">{t('staff')}</th>
              <th className="p-2 text-left">{t('baseSalary')}</th>
              <th className="p-2 text-left">{t('bonus')}</th>
              <th className="p-2 text-left">{t('deductions')}</th>
              <th className="p-2 text-left">{t('netSalary')}</th>
              <th className="p-2 text-left">{t('date')}</th>
              <th className="p-2 text-left">{t('status')}</th>
              <th className="p-2 text-left">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.map((salary) => (
              <tr key={salary.id} className="border-t">
                <td className="p-2">{salary.staff?.name || t('unknown')}</td>
                <td className="p-2">{currency}{salary.base_salary}</td>
                <td className="p-2">{currency}{salary.bonus}</td>
                <td className="p-2">{currency}{salary.deductions}</td>
                <td className="p-2">{currency}{calculateNetSalary(salary)}</td>
                <td className="p-2">{salary.payment_date}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded ${salary.status === 'Paid' ? 'bg-green-200' : 'bg-yellow-200'}`}>
                    {salary.status === 'Paid' ? t('paid') : t('pending')}
                  </span>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleEditSalary(salary)}
                    className="text-blue-600 mr-2 hover:underline"
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteSalary(salary.id, salary.staff?.name || t('unknown'))}
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

export default SalaryDetails;