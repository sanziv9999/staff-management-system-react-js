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
    na: "N/A",
    language: "Language"
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
    na: "なし",
    language: "言語"
  },
  ne: {
    title: "कर्मचारी व्यवस्थापन",
    addStaff: "कर्मचारी थप्नुहोस्",
    updateStaff: "कर्मचारी अपडेट गर्नुहोस्",
    name: "नाम",
    searchDept: "विभाग खोज्नुहोस्...",
    noDepts: "कुनै विभाग फेला परेन",
    email: "इमेल",
    searchPlaceholder: "नाम, भूमिका, विभाग, वा इमेलले खोज्नुहोस्...",
    id: "आईडी",
    department: "विभाग",
    actions: "कार्यहरू",
    viewDetails: "विवरण हेर्नुहोस्",
    delete: "मेटाउनुहोस्",
    staffDetails: "कर्मचारी विवरण",
    firstName: "पहिलो नाम",
    middleName: "मध्य नाम",
    lastName: "थर",
    fullName: "पुरा नाम",
    username: "प्रयोगकर्ता नाम",
    dob: "जन्म मिति",
    locationLat: "स्थान (अक्षांश)",
    locationLng: "स्थान (देशान्तर)",
    locationAddress: "स्थान ठेगाना",
    profilePic: "प्रोफाइल तस्वीर",
    cv: "सीभी",
    certType: "प्रमाणपत्र प्रकार",
    certTitle: "प्रमाणपत्र शीर्षक",
    certDesc: "प्रमाणपत्र विवरण",
    certIssueDate: "प्रमाणपत्र जारी मिति",
    certFile: "प्रमाणपत्र फाइल",
    view: "हेर्नुहोस्",
    close: "बन्द गर्नुहोस्",
    requiredFields: "सबै फिल्डहरू आवश्यक छन्",
    validEmail: "कृपया मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्",
    confirmDelete: "तपाईं निश्चित हुनुहुन्छ कि मेटाउन चाहनुहुन्छ",
    dataLoaded: "डाटा सफलतापूर्वक लोड भयो!",
    staffAdded: "कर्मचारी सफलतापूर्वक थपियो!",
    staffUpdated: "कर्मचारी सफलतापूर्वक अपडेट भयो!",
    staffDeleted: "कर्मचारी सफलतापूर्वक मेटाइयो!",
    loadError: "डाटा लोड गर्न असफल भयो। कृपया ब्याकेन्ड सर्भर चलिरहेको छ भनी निश्चित गर्नुहोस्।",
    addError: "कर्मचारी थप्न असफल भयो",
    updateError: "कर्मचारी अपडेट गर्न असफल भयो",
    deleteError: "कर्मचारी मेटाउन असफल भयो",
    na: "उपलब्ध छैन",
    language: "भाषा"
  },
  hi: {
    title: "स्टाफ प्रबंधन",
    addStaff: "स्टाफ जोड़ें",
    updateStaff: "स्टाफ अपडेट करें",
    name: "नाम",
    searchDept: "विभाग खोजें...",
    noDepts: "कोई विभाग नहीं मिला",
    email: "ईमेल",
    searchPlaceholder: "नाम, भूमिका, विभाग या ईमेल से खोजें...",
    id: "आईडी",
    department: "विभाग",
    actions: "कार्रवाई",
    viewDetails: "विवरण देखें",
    delete: "हटाएं",
    staffDetails: "स्टाफ विवरण",
    firstName: "पहला नाम",
    middleName: "मध्य नाम",
    lastName: "अंतिम नाम",
    fullName: "पूरा नाम",
    username: "उपयोगकर्ता नाम",
    dob: "जन्म तिथि",
    locationLat: "स्थान (अक्षांश)",
    locationLng: "स्थान (देशांतर)",
    locationAddress: "स्थान पता",
    profilePic: "प्रोफाइल चित्र",
    cv: "सीवी",
    certType: "प्रमाणपत्र प्रकार",
    certTitle: "प्रमाणपत्र शीर्षक",
    certDesc: "प्रमाणपत्र विवरण",
    certIssueDate: "प्रमाणपत्र जारी तिथि",
    certFile: "प्रमाणपत्र फाइल",
    view: "देखें",
    close: "बंद करें",
    requiredFields: "सभी फ़ील्ड आवश्यक हैं",
    validEmail: "कृपया एक वैध ईमेल पता दर्ज करें",
    confirmDelete: "क्या आप वाकई हटाना चाहते हैं",
    dataLoaded: "डेटा सफलतापूर्वक लोड हो गया!",
    staffAdded: "स्टाफ सफलतापूर्वक जोड़ा गया!",
    staffUpdated: "स्टाफ सफलतापूर्वक अपडेट हो गया!",
    staffDeleted: "स्टाफ सफलतापूर्वक हटा दिया गया!",
    loadError: "डेटा लोड करने में विफल। कृपया सुनिश्चित करें कि बैकएंड सर्वर चल रहा है।",
    addError: "स्टाफ जोड़ने में विफल",
    updateError: "स्टाफ अपडेट करने में विफल",
    deleteError: "स्टाफ हटाने में विफल",
    na: "उपलब्ध नहीं",
    language: "भाषा"
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
  const [selectedStaff, setSelectedStaff] = useState(null);
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

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800">{t('title')}</h2>
        <div className="relative">
          <span className="mr-2">{t('language')}:</span>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="p-2 border rounded bg-white"
          >
            <option value="en">English</option>
            <option value="ja">日本語 (Japanese)</option>
            <option value="ne">नेपाली (Nepali)</option>
            <option value="hi">हिन्दी (Hindi)</option>
          </select>
        </div>
      </div>
      
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">{t('fullName')}</h4>
                <p className="text-gray-600">
                  {`${selectedStaff.first_name || ''} ${selectedStaff.middle_name || ''} ${selectedStaff.last_name || ''}`.trim() || t('na')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">{t('username')}</h4>
                <p className="text-gray-600">{selectedStaff.username || t('na')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">{t('email')}</h4>
                <p className="text-gray-600">{selectedStaff.email || t('na')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">{t('department')}</h4>
                <p className="text-gray-600">
                  {selectedStaff.department_name ||
                    (departments.find((d) => d.id === selectedStaff.department)?.name) ||
                    t('na')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">{t('dob')}</h4>
                <p className="text-gray-600">{selectedStaff.dob || t('na')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">{t('locationAddress')}</h4>
                <p className="text-gray-600">{selectedStaff.location_address || t('na')}</p>
              </div>
            </div>
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