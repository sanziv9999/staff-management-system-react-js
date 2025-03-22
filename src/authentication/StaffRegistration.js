import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import API_BASE_URL from '../api';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function StaffRegistration({ setToken, setIsStaff }) {
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

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/departments/`);
        setDepartments(response.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Failed to load departments.');
      } finally {
        setIsMapReady(true);
      }
    };
    fetchDepartments();
  }, []);

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
          } catch (err) {
            setError('Could not retrieve address.');
          }
        },
        (err) => {
          setError(`Unable to retrieve location: ${err.message}`);
        }
      );
    } else {
      setError('Geolocation not supported.');
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
          })
          .catch((err) => {
            setError('Could not retrieve address from map.');
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
      setError('Passwords do not match.');
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
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/staff-login'), 1500);
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.detail || 
                       error.response?.data?.email?.[0] || 
                       error.response?.data?.username?.[0] || 
                       'Registration failed.';
      setError(errorMsg);
      setSuccess('');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl p-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Staff Registration</h2>
        <form onSubmit={handleRegistration} className="space-y-6">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
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
              <label htmlFor="middle_name" className="block text-sm font-semibold text-gray-700 mb-1">Middle Name</label>
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
              <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
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
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
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
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
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
              <label htmlFor="dob" className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
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
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
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
              <label htmlFor="confirm_password" className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
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
              <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
              <button
                type="button"
                onClick={handleLocationClick}
                className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Use My Current Location
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
              <label htmlFor="profile_picture" className="block text-sm font-semibold text-gray-700 mb-1">Profile Picture</label>
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
              <label htmlFor="cv" className="block text-sm font-semibold text-gray-700 mb-1">CV</label>
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
              <label htmlFor="certificate_file" className="block text-sm font-semibold text-gray-700 mb-1">Certificate File</label>
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
              <label htmlFor="certificate_type" className="block text-sm font-semibold text-gray-700 mb-1">Certificate Type</label>
              <select
                id="certificate_type"
                name="certificate_type"
                value={formData.certificate_type}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              >
                <option value="">Select Type (Optional)</option>
                <option value="Experience">Experience</option>
                <option value="Training">Training</option>
                <option value="Achievement">Achievement</option>
              </select>
            </div>
            <div>
              <label htmlFor="certificate_title" className="block text-sm font-semibold text-gray-700 mb-1">Certificate Title</label>
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
              <label htmlFor="certificate_description" className="block text-sm font-semibold text-gray-700 mb-1">Certificate Description</label>
              <textarea
                id="certificate_description"
                name="certificate_description"
                value={formData.certificate_description}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="certificate_issue_date" className="block text-sm font-semibold text-gray-700 mb-1">Certificate Issue Date</label>
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
            Register
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/staff-login" className="text-blue-600 hover:underline font-medium">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default StaffRegistration;