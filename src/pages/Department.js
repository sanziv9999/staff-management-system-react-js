import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';

// Translation dictionary
const translations = {
  en: {
    title: "Department Management",
    deptName: "Department Name",
    manager: "Manager",
    staffCount: "Staff Count",
    addDept: "Add Department",
    updateDept: "Update Department",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete",
    loginError: "Please log in to access this page.",
    fetchError: "Failed to load data. Please ensure the backend server is running or check your login credentials.",
    addError: "Failed to add department",
    updateError: "Failed to update department",
    deleteError: "Failed to delete department",
    requiredFields: "All fields are required, and Staff Count must be a valid number",
    searchPlaceholder: "Search by name, manager, or staff count...",
    name: "Name",
    actions: "Actions"
  },
  ja: {
    title: "部門管理",
    deptName: "部門名",
    manager: "管理者",
    staffCount: "スタッフ数",
    addDept: "部門を追加",
    updateDept: "部門を更新",
    edit: "編集",
    delete: "削除",
    confirmDelete: "この部門を削除してもよろしいですか",
    loginError: "このページにアクセスするにはログインしてください。",
    fetchError: "データの読み込みに失敗しました。バックエンドサーバーが実行されているか、ログイン資格情報を確認してください。",
    addError: "部門の追加に失敗しました",
    updateError: "部門の更新に失敗しました",
    deleteError: "部門の削除に失敗しました",
    requiredFields: "すべてのフィールドが必要であり、スタッフ数は有効な数字でなければなりません",
    searchPlaceholder: "名前、管理者、またはスタッフ数で検索...",
    name: "名前",
    actions: "操作"
  }
};

function Department({ token }) {
  const [language, setLanguage] = useState('en');
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState({ name: '', manager: '', staff_count: '' });
  const [editingDept, setEditingDept] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/departments/`);
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        setError(t('fetchError'));
      }
    };
    fetchDepartments();
  }, [token, language]);

  const handleAddDept = async (e) => {
    e.preventDefault();
    const staffCount = parseInt(newDept.staff_count);
    if (!newDept.name || !newDept.manager || isNaN(staffCount)) {
      setError(t('requiredFields'));
      return;
    }
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/departments/`, {
        ...newDept,
        staff_count: staffCount,
      });
      setDepartments([...departments, response.data]);
      setNewDept({ name: '', manager: '', staff_count: '' });
    } catch (error) {
      console.error('Error adding department:', error.response?.data || error.message);
      setError(t('addError') + ': ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEditDept = (dept) => {
    setEditingDept(dept);
    setNewDept({
      name: dept.name,
      manager: dept.manager,
      staff_count: dept.staff_count.toString(),
    });
    setError('');
  };

  const handleUpdateDept = async (e) => {
    e.preventDefault();
    if (!editingDept) return;
    const staffCount = parseInt(newDept.staff_count);
    if (!newDept.name || !newDept.manager || isNaN(staffCount)) {
      setError(t('requiredFields'));
      return;
    }
    setError('');
    try {
      const response = await axios.put(`${API_BASE_URL}/departments/${editingDept.id}/`, {
        ...newDept,
        staff_count: staffCount,
      });
      setDepartments(departments.map(dept => dept.id === editingDept.id ? response.data : dept));
      setEditingDept(null);
      setNewDept({ name: '', manager: '', staff_count: '' });
    } catch (error) {
      console.error('Error updating department:', error.response?.data || error.message);
      setError(t('updateError') + ': ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDeleteDept = async (id, name) => {
    const confirmed = window.confirm(`${t('confirmDelete')} ${name || t('this department')}?`);
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/departments/${id}/`);
        setDepartments(departments.filter(dept => dept.id !== id));
      } catch (error) {
        console.error('Error deleting department:', error);
        setError(t('deleteError') + ': ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDept) {
      handleUpdateDept(e);
    } else {
      handleAddDept(e);
    }
  };

  const handleStaffCountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*$/.test(value)) {
      setNewDept({ ...newDept, staff_count: value });
      setError('');
    } else {
      setError(t('requiredFields'));
    }
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.staff_count.toString().includes(searchTerm)
  );

  if (!token) {
    return <p className="text-red-600">{t('loginError')}</p>;
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder={t('deptName')}
            value={newDept.name}
            onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder={t('manager')}
            value={newDept.manager}
            onChange={(e) => setNewDept({ ...newDept, manager: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder={t('staffCount')}
            value={newDept.staff_count}
            onChange={handleStaffCountChange}
            className="p-2 border rounded"
            required
          />
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editingDept ? t('updateDept') : t('addDept')}
        </button>
      </form>
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
              <th className="p-2 text-left">{t('name')}</th>
              <th className="p-2 text-left">{t('manager')}</th>
              <th className="p-2 text-left">{t('staffCount')}</th>
              <th className="p-2 text-left">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((dept) => (
              <tr key={dept.id} className="border-t">
                <td className="p-2">{dept.name}</td>
                <td className="p-2">{dept.manager}</td>
                <td className="p-2">{dept.staff_count}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEditDept(dept)}
                    className="text-blue-600 mr-2 hover:underline"
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteDept(dept.id, dept.name)}
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

export default Department;