import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from '../api';

// Translation dictionary
const translations = {
  en: {
    title: "Staff Management",
    addStaff: "Add Staff",
    updateStaff: "Update Staff",
    name: "Name",
    searchDept: "Search Department...",
    noDepts: "No departments found",
    email: "Email",
    searchPlaceholder: "Search by name, role, department, or email...",
    id: "ID",
    department: "Department",
    actions: "Actions",
    viewDetails: "View Details",
    delete: "Delete",
    staffDetails: "Staff Details",
    firstName: "First Name",
    middleName: "Middle Name",
    lastName: "Last Name",
    fullName: "Full Name",
    username: "Username",
    dob: "Date of Birth",
    locationLat: "Location (Latitude)",
    locationLng: "Location (Longitude)",
    locationAddress: "Location Address",
    profilePic: "Profile Picture",
    cv: "CV",
    certType: "Certificate Type",
    certTitle: "Certificate Title",
    certDesc: "Certificate Description",
    certIssueDate: "Certificate Issue Date",
    certFile: "Certificate File",
    view: "View",
    close: "Close",
    requiredFields: "All fields are required",
    validEmail: "Please enter a valid email address",
    confirmDelete: "Are you sure you want to delete",
    dataLoaded: "Data loaded successfully!",
    staffAdded: "Staff added successfully!",
    staffUpdated: "Staff updated successfully!",
    staffDeleted: "Staff deleted successfully!",
    loadError: "Failed to load data. Please ensure the backend server is running.",
    addError: "Failed to add staff",
    updateError: "Failed to update staff",
    deleteError: "Failed to delete staff",
    na: "N/A"
  },
  ja: {
    title: "スタッフ管理",
    addStaff: "スタッフを追加",
    updateStaff: "スタッフを更新",
    name: "名前",
    searchDept: "部門を検索...",
    noDepts: "部門が見つかりません",
    email: "メールアドレス",
    searchPlaceholder: "名前、役職、部門、またはメールで検索...",
    id: "ID",
    department: "部門",
    actions: "操作",
    viewDetails: "詳細を見る",
    delete: "削除",
    staffDetails: "スタッフ詳細",
    firstName: "名",
    middleName: "ミドルネーム",
    lastName: "姓",
    fullName: "フルネーム",
    username: "ユーザー名",
    dob: "生年月日",
    locationLat: "位置情報（緯度）",
    locationLng: "位置情報（経度）",
    locationAddress: "住所",
    profilePic: "プロフィール画像",
    cv: "履歴書",
    certType: "証明書タイプ",
    certTitle: "証明書タイトル",
    certDesc: "証明書説明",
    certIssueDate: "証明書発行日",
    certFile: "証明書ファイル",
    view: "表示",
    close: "閉じる",
    requiredFields: "すべてのフィールドが必要です",
    validEmail: "有効なメールアドレスを入力してください",
    confirmDelete: "本当に削除しますか",
    dataLoaded: "データの読み込みに成功しました！",
    staffAdded: "スタッフの追加に成功しました！",
    staffUpdated: "スタッフの更新に成功しました！",
    staffDeleted: "スタッフの削除に成功しました！",
    loadError: "データの読み込みに失敗しました。バックエンドサーバーが実行されていることを確認してください。",
    addError: "スタッフの追加に失敗しました",
    updateError: "スタッフの更新に失敗しました",
    deleteError: "スタッフの削除に失敗しました",
    na: "なし"
  }
};

function Staff() {
  const [language, setLanguage] = useState('en');
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newStaff, setNewStaff] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    username: '',
    email: '',
    department: '',
    dob: '',
    location_lat: '',
    location_lng: '',
    location_address: '',
    certificate_type: '',
    certificate_title: '',
    certificate_description: '',
    certificate_issue_date: ''
  });
  const [editingStaff, setEditingStaff] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null); // Removed duplicate declaration
  const [deptSearch, setDeptSearch] = useState('');
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const t = (key) => translations[language][key] || key;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffResponse, deptResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/staff/`),
          axios.get(`${API_BASE_URL}/departments/`),
        ]);
        setStaffList(staffResponse.data);
        setDepartments(deptResponse.data);
        toast.success(t('dataLoaded'), { autoClose: 2000 });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(t('loadError'));
        toast.error(t('loadError'), { autoClose: 3000 });
      }
    };
    fetchData();
  }, [language]);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.first_name || !newStaff.last_name || !newStaff.email || !newStaff.department) {
      setError(t('requiredFields'));
      toast.error(t('requiredFields'), { autoClose: 3000 });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStaff.email)) {
      setError(t('validEmail'));
      toast.error(t('validEmail'), { autoClose: 3000 });
      return;
    }
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/staff/`, newStaff, {
        headers: { 'Content-Type': 'application/json' },
      });
      setStaffList([...staffList, response.data]);
      setNewStaff({
        first_name: '',
        middle_name: '',
        last_name: '',
        username: '',
        email: '',
        department: '',
        dob: '',
        location_lat: '',
        location_lng: '',
        location_address: '',
        certificate_type: '',
        certificate_title: '',
        certificate_description: '',
        certificate_issue_date: ''
      });
      setDeptSearch('');
      setShowDeptDropdown(false);
      toast.success(t('staffAdded'), { autoClose: 2000 });
    } catch (error) {
      console.error('Error adding staff:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.detail || error.message;
      setError(t('addError') + ': ' + errorMsg);
      toast.error(t('addError') + ': ' + errorMsg, { autoClose: 3000 });
    }
  };

  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    setNewStaff({
      first_name: staff.first_name || '',
      middle_name: staff.middle_name || '',
      last_name: staff.last_name || '',
      username: staff.username || '',
      email: staff.email || '',
      department: staff.department || '',
      dob: staff.dob || '',
      location_lat: staff.location_lat || '',
      location_lng: staff.location_lng || '',
      location_address: staff.location_address || '',
      certificate_type: staff.certificate_type || '',
      certificate_title: staff.certificate_title || '',
      certificate_description: staff.certificate_description || '',
      certificate_issue_date: staff.certificate_issue_date || ''
    });
    const dept = departments.find((d) => d.id === staff.department);
    setDeptSearch(dept ? dept.name : '');
    setShowDeptDropdown(false);
    setError('');
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    if (!editingStaff) return;
    if (!newStaff.first_name || !newStaff.last_name || !newStaff.email || !newStaff.department) {
      setError(t('requiredFields'));
      toast.error(t('requiredFields'), { autoClose: 3000 });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStaff.email)) {
      setError(t('validEmail'));
      toast.error(t('validEmail'), { autoClose: 3000 });
      return;
    }
    setError('');
    try {
      const response = await axios.put(`${API_BASE_URL}/staff/${editingStaff.id}/`, newStaff, {
        headers: { 'Content-Type': 'application/json' },
      });
      setStaffList(staffList.map((staff) => (staff.id === editingStaff.id ? response.data : staff)));
      setEditingStaff(null);
      setNewStaff({
        first_name: '',
        middle_name: '',
        last_name: '',
        username: '',
        email: '',
        department: '',
        dob: '',
        location_lat: '',
        location_lng: '',
        location_address: '',
        certificate_type: '',
        certificate_title: '',
        certificate_description: '',
        certificate_issue_date: ''
      });
      setDeptSearch('');
      setShowDeptDropdown(false);
      toast.success(t('staffUpdated'), { autoClose: 2000 });
    } catch (error) {
      console.error('Error updating staff:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.detail || error.message;
      setError(t('updateError') + ': ' + errorMsg);
      toast.error(t('updateError') + ': ' + errorMsg, { autoClose: 3000 });
    }
  };

  const handleDeleteStaff = async (id, name) => {
    const confirmed = window.confirm(`${t('confirmDelete')} ${name || t('thisStaff')}?`);
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/staff/${id}/`);
        setStaffList(staffList.filter((staff) => staff.id !== id));
        toast.success(t('staffDeleted'), { autoClose: 2000 });
      } catch (error) {
        console.error('Error deleting staff:', error);
        const errorMsg = error.response?.data?.detail || error.message;
        setError(t('deleteError') + ': ' + errorMsg);
        toast.error(t('deleteError') + ': ' + errorMsg, { autoClose: 3000 });
      }
    }
  };

  const handleViewDetails = (staff) => {
    setSelectedStaff(staff);
  };

  const closeModal = () => {
    setSelectedStaff(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStaff) {
      handleUpdateStaff(e);
    } else {
      handleAddStaff(e);
    }
  };

  const filteredDepartments = deptSearch
    ? departments.filter((dept) =>
        dept.name?.toLowerCase().includes(deptSearch.toLowerCase())
      )
    : departments.sort((a, b) => b.id - a.id).slice(0, 3);

  const handleDeptSelect = (dept) => {
    setNewStaff({ ...newStaff, department: dept.id });
    setDeptSearch(dept.name);
    setShowDeptDropdown(false);
  };

  const filteredStaff = staffList.filter((staff) => {
    const departmentName =
      staff.department_name ||
      (departments.find((d) => d.id === staff.department)?.name) ||
      '';
    const name = `${staff.first_name || ''} ${staff.last_name || ''}`.trim();
    const email = staff.email || '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">{t('title')}</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-2xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder={t('firstName')}
            value={newStaff.first_name}
            onChange={(e) => setNewStaff({ ...newStaff, first_name: e.target.value })}
            className="p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400"
            required
          />
          <input
            type="text"
            placeholder={t('lastName')}
            value={newStaff.last_name}
            onChange={(e) => setNewStaff({ ...newStaff, last_name: e.target.value })}
            className="p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400"
            required
          />
          <div className="relative">
            <input
              type="text"
              placeholder={t('searchDept')}
              value={deptSearch}
              onChange={(e) => {
                setDeptSearch(e.target.value);
                setShowDeptDropdown(true);
              }}
              onFocus={() => setShowDeptDropdown(true)}
              onBlur={() => setTimeout(() => setShowDeptDropdown(false), 200)}
              className="p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400 w-full"
              required
            />
            {showDeptDropdown && (
              <ul className="absolute z-10 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto w-full">
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((dept) => (
                    <li
                      key={dept.id}
                      onClick={() => handleDeptSelect(dept)}
                      onMouseDown={(e) => e.preventDefault()}
                      className="p-3 hover:bg-gray-100 cursor-pointer text-gray-700"
                    >
                      {dept.name}
                    </li>
                  ))
                ) : (
                  <li className="p-3 text-gray-500">{t('noDepts')}</li>
                )}
              </ul>
            )}
          </div>
          <input
            type="email"
            placeholder={t('email')}
            value={newStaff.email}
            onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
            className="p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400"
            required
          />
        </div>
        
        {error && <p className="text-red-500 text-center font-medium mt-4">{error}</p>}
        
        <button
          type="submit"
          className="mt-6 w-full p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition font-semibold"
        >
          {editingStaff ? t('updateStaff') : t('addStaff')}
        </button>
      </form>

      <input
        type="text"
        placeholder={t('searchPlaceholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/3 p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400 mb-6"
      />

      <div className="bg-white rounded-xl shadow-2xl overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-gray-700 font-semibold">{t('id')}</th>
              <th className="p-3 text-left text-gray-700 font-semibold">{t('name')}</th>
              <th className="p-3 text-left text-gray-700 font-semibold">{t('department')}</th>
              <th className="p-3 text-left text-gray-700 font-semibold">{t('email')}</th>
              <th className="p-3 text-left text-gray-700 font-semibold">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staff) => (
              <tr key={staff.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{staff.id}</td>
                <td className="p-3">{`${staff.first_name || ''} ${staff.last_name || ''}`.trim() || t('na')}</td>
                <td className="p-3">
                  {staff.department_name ||
                    (departments.find((d) => d.id === staff.department)?.name) ||
                    t('na')}
                </td>
                <td className="p-3">{staff.email || t('na')}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleViewDetails(staff)}
                    className="text-blue-600 mr-4 hover:underline font-medium"
                  >
                    {t('viewDetails')}
                  </button>
                  <button
                    onClick={() => handleEditStaff(staff)}
                    className="text-green-600 mr-4 hover:underline font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStaff(staff.id, `${staff.first_name} ${staff.last_name}`)}
                    className="text-red-600 hover:underline font-medium"
                  >
                    {t('delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-extrabold text-gray-800 mb-6">{t('staffDetails')}</h3>
            {/* Modal content remains the same */}
            {/* ... [rest of the modal JSX remains unchanged] */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="p-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition font-semibold"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default Staff;