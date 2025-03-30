import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from '../api';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Translation dictionary
const translations = {
  en: {
    title: "Staff Registration",
    firstName: "First Name",
    middleName: "Middle Name",
    lastName: "Last Name",
    username: "Username",
    email: "Email",
    dob: "Date of Birth",
    password: "Password",
    confirmPassword: "Confirm Password",
    department: "Department",
    selectDepartment: "Select a department",
    location: "Location",
    useCurrentLocation: "Use My Current Location",
    profilePicture: "Profile Picture",
    cv: "CV",
    certificateFile: "Certificate File",
    certificateType: "Certificate Type",
    selectType: "Select Type (Optional)",
    experience: "Experience",
    training: "Training",
    achievement: "Achievement",
    certificateTitle: "Certificate Title",
    certificateDescription: "Certificate Description",
    certificateIssueDate: "Certificate Issue Date",
    register: "Register",
    alreadyHaveAccount: "Already have an account?",
    loginHere: "Login here",
    language: "Language",
    errorPasswordsNotMatch: "Passwords do not match.",
    errorFailedLoadDepartments: "Failed to load departments.",
    errorCouldNotRetrieveAddress: "Could not retrieve address.",
    errorGeolocationNotSupported: "Geolocation not supported.",
    errorUnableRetrieveLocation: "Unable to retrieve location",
    successLocationRetrieved: "Location retrieved successfully!",
    successLocationUpdated: "Location updated from map!",
    successRegistration: "Registration successful! Redirecting..."
  },
  ja: {
    title: "スタッフ登録",
    firstName: "名",
    middleName: "ミドルネーム",
    lastName: "姓",
    username: "ユーザー名",
    email: "メール",
    dob: "生年月日",
    password: "パスワード",
    confirmPassword: "パスワードの確認",
    department: "部門",
    selectDepartment: "部門を選択",
    location: "場所",
    useCurrentLocation: "現在の位置を使用",
    profilePicture: "プロフィール写真",
    cv: "履歴書",
    certificateFile: "証明書ファイル",
    certificateType: "証明書の種類",
    selectType: "種類を選択（任意）",
    experience: "経験",
    training: "トレーニング",
    achievement: "実績",
    certificateTitle: "証明書のタイトル",
    certificateDescription: "証明書の説明",
    certificateIssueDate: "証明書の発行日",
    register: "登録",
    alreadyHaveAccount: "すでにアカウントをお持ちですか？",
    loginHere: "ここでログイン",
    language: "言語",
    errorPasswordsNotMatch: "パスワードが一致しません。",
    errorFailedLoadDepartments: "部門の読み込みに失敗しました。",
    errorCouldNotRetrieveAddress: "住所を取得できませんでした。",
    errorGeolocationNotSupported: "ジオロケーションがサポートされていません。",
    errorUnableRetrieveLocation: "位置情報を取得できません",
    successLocationRetrieved: "位置情報が正常に取得されました！",
    successLocationUpdated: "マップから位置が更新されました！",
    successRegistration: "登録が成功しました！リダイレクト中..."
  },
  ne: {
    title: "कर्मचारी दर्ता",
    firstName: "पहिलो नाम",
    middleName: "बीचको नाम",
    lastName: "थर",
    username: "प्रयोगकर्ता नाम",
    email: "इमेल",
    dob: "जन्म मिति",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड पुष्टि गर्नुहोस्",
    department: "विभाग",
    selectDepartment: "विभाग छान्नुहोस्",
    location: "स्थान",
    useCurrentLocation: "मेरो हालको स्थान प्रयोग गर्नुहोस्",
    profilePicture: "प्रोफाइल तस्वीर",
    cv: "सीभी",
    certificateFile: "प्रमाणपत्र फाइल",
    certificateType: "प्रमाणपत्र प्रकार",
    selectType: "प्रकार छान्नुहोस् (वैकल्पिक)",
    experience: "अनुभव",
    training: "प्रशिक्षण",
    achievement: "उपलब्धि",
    certificateTitle: "प्रमाणपत्र शीर्षक",
    certificateDescription: "प्रमाणपत्र विवरण",
    certificateIssueDate: "प्रमाणपत्र जारी मिति",
    register: "दर्ता गर्नुहोस्",
    alreadyHaveAccount: "पहिल्यै खाता छ?",
    loginHere: "यहाँ लगइन गर्नुहोस्",
    language: "भाषा",
    errorPasswordsNotMatch: "पासवर्डहरू मेल खाँदैनन्।",
    errorFailedLoadDepartments: "विभागहरू लोड गर्न असफल भयो।",
    errorCouldNotRetrieveAddress: "ठेगाना प्राप्त गर्न सकिएन।",
    errorGeolocationNotSupported: "जियोलेकेसन समर्थित छैन।",
    errorUnableRetrieveLocation: "स्थान प्राप्त गर्न असमर्थ",
    successLocationRetrieved: "स्थान सफलतापूर्वक प्राप्त भयो!",
    successLocationUpdated: "नक्शाबाट स्थान अपडेट भयो!",
    successRegistration: "दर्ता सफल भयो! पुनर्निर्देशन गर्दै..."
  },
  hi: {
    title: "कर्मचारी पंजीकरण",
    firstName: "पहला नाम",
    middleName: "मध्य नाम",
    lastName: "उपनाम",
    username: "उपयोगकर्ता नाम",
    email: "ईमेल",
    dob: "जन्म तिथि",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    department: "विभाग",
    selectDepartment: "एक विभाग चुनें",
    location: "स्थान",
    useCurrentLocation: "मेरा वर्तमान स्थान उपयोग करें",
    profilePicture: "प्रोफाइल चित्र",
    cv: "सीवी",
    certificateFile: "प्रमाणपत्र फ़ाइल",
    certificateType: "प्रमाणपत्र प्रकार",
    selectType: "प्रकार चुनें (वैकल्पिक)",
    experience: "अनुभव",
    training: "प्रशिक्षण",
    achievement: "उपलब्धि",
    certificateTitle: "प्रमाणपत्र शीर्षक",
    certificateDescription: "प्रमाणपत्र विवरण",
    certificateIssueDate: "प्रमाणपत्र जारी तिथि",
    register: "पंजीकरण करें",
    alreadyHaveAccount: "क्या आपके पास पहले से खाता है?",
    loginHere: "यहाँ लॉगिन करें",
    language: "भाषा",
    errorPasswordsNotMatch: "पासवर्ड मेल नहीं खाते।",
    errorFailedLoadDepartments: "विभाग लोड करने में विफल।",
    errorCouldNotRetrieveAddress: "पता प्राप्त नहीं कर सका।",
    errorGeolocationNotSupported: "जियोलोकेशन समर्थित नहीं है।",
    errorUnableRetrieveLocation: "स्थान प्राप्त करने में असमर्थ",
    successLocationRetrieved: "स्थान सफलतापूर्वक प्राप्त हुआ!",
    successLocationUpdated: "मानचित्र से स्थान अपडेट हुआ!",
    successRegistration: "पंजीकरण सफल हुआ! पुनर्निर्देशन कर रहा है..."
  }
};

function StaffRegistration({ setToken, setIsStaff }) {
  const [language, setLanguage] = useState('en');
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    department: '',
    dob: '',
    location_lat: 51.505,
    location_lng: -0.09,
    location_address: '',
    profile_picture: null,
    cv: null,
    certificate_type: '',
    certificate_title: '',
    certificate_description: '',
    certificate_issue_date: '',
    certificate_file: null,
  });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const navigate = useNavigate();

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const t = (key) => translations[language][key] || key;

  // Handle language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/departments/`);
        setDepartments(response.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError(t('errorFailedLoadDepartments'));
        toast.error(t('errorFailedLoadDepartments'), { autoClose: 3000 });
      } finally {
        setIsMapReady(true);
      }
    };
    fetchDepartments();
  }, [language]); // Added language dependency to refetch if language changes

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            location_lat: latitude,
            location_lng: longitude,
          }));
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            setFormData((prev) => ({
              ...prev,
              location_address: response.data.display_name,
            }));
            toast.success(t('successLocationRetrieved'), { autoClose: 2000 });
          } catch (err) {
            setError(t('errorCouldNotRetrieveAddress'));
            toast.error(t('errorCouldNotRetrieveAddress'), { autoClose: 3000 });
          }
        },
        (err) => {
          setError(`${t('errorUnableRetrieveLocation')}: ${err.message}`);
          toast.error(`${t('errorUnableRetrieveLocation')}: ${err.message}`, { autoClose: 3000 });
        }
      );
    } else {
      setError(t('errorGeolocationNotSupported'));
      toast.error(t('errorGeolocationNotSupported'), { autoClose: 3000 });
    }
  };

  const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        map.setView([lat, lng], 13);
      }
    }, [lat, lng, map]);
    return null;
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setFormData((prev) => ({
          ...prev,
          location_lat: e.latlng.lat,
          location_lng: e.latlng.lng,
        }));
        axios
          .get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
          .then((response) => {
            setFormData((prev) => ({
              ...prev,
              location_address: response.data.display_name,
            }));
            toast.success(t('successLocationUpdated'), { autoClose: 2000 });
          })
          .catch((err) => {
            setError(t('errorCouldNotRetrieveAddress'));
            toast.error(t('errorCouldNotRetrieveAddress'), { autoClose: 3000 });
          });
      },
    });
    return formData.location_lat && formData.location_lng ? (
      <Marker position={[formData.location_lat, formData.location_lng]} />
    ) : null;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError(t('errorPasswordsNotMatch'));
      toast.error(t('errorPasswordsNotMatch'), { autoClose: 3000 });
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== '' && key !== 'name') {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/staff/register/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { access, is_staff, department, staff_id, user_name } = response.data;
      setToken(access);
      setIsStaff(is_staff);
      localStorage.setItem('token', access);
      localStorage.setItem('is_staff', is_staff);
      localStorage.setItem('department', department);
      localStorage.setItem('staff_id', staff_id);
      localStorage.setItem('user_name', user_name);
      setSuccess(t('successRegistration'));
      toast.success(t('successRegistration'), { autoClose: 1500 });
      setTimeout(() => navigate('/staff-login'), 1500);
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.detail || 
                       error.response?.data?.email?.[0] || 
                       error.response?.data?.username?.[0] || 
                       'Registration failed.';
      setError(errorMsg);
      toast.error(errorMsg, { autoClose: 3000 });
      setSuccess('');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col p-6">
      {/* Navbar for Language Selection */}
      <nav className="bg-gray-800 p-4 mb-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">{t('title')}</h1>
          <div className="flex space-x-4">
            <span className="text-white">{t('language')}:</span>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`text-white ${language === 'en' ? 'font-bold' : ''} hover:underline`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('ja')}
              className={`text-white ${language === 'ja' ? 'font-bold' : ''} hover:underline`}
            >
              日本語
            </button>
            <button
              onClick={() => handleLanguageChange('ne')}
              className={`text-white ${language === 'ne' ? 'font-bold' : ''} hover:underline`}
            >
              नेपाली
            </button>
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`text-white ${language === 'hi' ? 'font-bold' : ''} hover:underline`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </nav>

      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl p-8 mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">{t('title')}</h2>
        <form onSubmit={handleRegistration} className="space-y-6">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700 mb-1">{t('firstName')}</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="middle_name" className="block text-sm font-semibold text-gray-700 mb-1">{t('middleName')}</label>
              <input
                type="text"
                id="middle_name"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700 mb-1">{t('lastName')}</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>
          </div>

          {/* Credentials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">{t('username')}</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">{t('email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-semibold text-gray-700 mb-1">{t('dob')}</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">{t('password')}</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            <div className="relative">
              <label htmlFor="confirm_password" className="block text-sm font-semibold text-gray-700 mb-1">{t('confirmPassword')}</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>
          </div>

          {/* Department and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-1">{t('department')}</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              >
                <option value="">{t('selectDepartment')}</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('location')}</label>
              <button
                type="button"
                onClick={handleLocationClick}
                className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                {t('useCurrentLocation')}
              </button>
              <input
                type="text"
                id="location_address"
                name="location_address"
                value={formData.location_address}
                onChange={handleChange}
                className="w-full p-3 mt-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                readOnly
              />
            </div>
          </div>

          {/* Map */}
          {isMapReady && (
            <div className="w-full">
              <MapContainer
                center={[formData.location_lat, formData.location_lng]}
                zoom={13}
                style={{ height: '250px', width: '100%', borderRadius: '8px' }}
                className="shadow-md"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
                <RecenterMap lat={formData.location_lat} lng={formData.location_lng} />
              </MapContainer>
            </div>
          )}

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="profile_picture" className="block text-sm font-semibold text-gray-700 mb-1">{t('profilePicture')}</label>
              <input
                type="file"
                id="profile_picture"
                name="profile_picture"
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition"
                accept="image/*"
              />
            </div>
            <div>
              <label htmlFor="cv" className="block text-sm font-semibold text-gray-700 mb-1">{t('cv')}</label>
              <input
                type="file"
                id="cv"
                name="cv"
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition"
                accept=".pdf,.doc,.docx"
              />
            </div>
            <div>
              <label htmlFor="certificate_file" className="block text-sm font-semibold text-gray-700 mb-1">{t('certificateFile')}</label>
              <input
                type="file"
                id="certificate_file"
                name="certificate_file"
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition"
              />
            </div>
          </div>

          {/* Certificate Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="certificate_type" className="block text-sm font-semibold text-gray-700 mb-1">{t('certificateType')}</label>
              <select
                id="certificate_type"
                name="certificate_type"
                value={formData.certificate_type}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              >
                <option value="">{t('selectType')}</option>
                <option value="Experience">{t('experience')}</option>
                <option value="Training">{t('training')}</option>
                <option value="Achievement">{t('achievement')}</option>
              </select>
            </div>
            <div>
              <label htmlFor="certificate_title" className="block text-sm font-semibold text-gray-700 mb-1">{t('certificateTitle')}</label>
              <input
                type="text"
                id="certificate_title"
                name="certificate_title"
                value={formData.certificate_title}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="certificate_description" className="block text-sm font-semibold text-gray-700 mb-1">{t('certificateDescription')}</label>
              <textarea
                id="certificate_description"
                name="certificate_description"
                value={formData.certificate_description}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="certificate_issue_date" className="block text-sm font-semibold text-gray-700 mb-1">{t('certificateIssueDate')}</label>
              <input
                type="date"
                id="certificate_issue_date"
                name="certificate_issue_date"
                value={formData.certificate_issue_date}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Messages and Submit */}
          {error && <p className="text-red-500 text-center font-medium">{error}</p>}
          {success && <p className="text-green-500 text-center font-medium">{success}</p>}
          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition font-semibold"
          >
            {t('register')}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          {t('alreadyHaveAccount')}{' '}
          <a href="/staff-login" className="text-blue-600 hover:underline font-medium">{t('loginHere')}</a>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default StaffRegistration;