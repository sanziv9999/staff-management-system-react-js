import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from '../api';

function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newStaff, setNewStaff] = useState({ name: '', department: '', email: '' });
  const [editingStaff, setEditingStaff] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null); // For viewing details
  const [deptSearch, setDeptSearch] = useState('');
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Fetch staff and departments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffResponse, deptResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/staff/`),
          axios.get(`${API_BASE_URL}/departments/`),
        ]);
        setStaffList(staffResponse.data);
        setDepartments(deptResponse.data);
        toast.success('Data loaded successfully!', { autoClose: 2000 });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please ensure the backend server is running.');
        toast.error('Failed to load data. Please ensure the backend server is running.', { autoClose: 3000 });
      }
    };
    fetchData();
  }, []);

  // Handle adding a new staff member
  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.department || !newStaff.email) {
      setError('All fields are required');
      toast.error('All fields are required', { autoClose: 3000 });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStaff.email)) {
      setError('Please enter a valid email address');
      toast.error('Please enter a valid email address', { autoClose: 3000 });
      return;
    }
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/staff/`, newStaff, {
        headers: { 'Content-Type': 'application/json' },
      });
      setStaffList([...staffList, response.data]);
      setNewStaff({ name: '', department: '', email: '' });
      setDeptSearch('');
      setShowDeptDropdown(false);
      toast.success('Staff added successfully!', { autoClose: 2000 });
    } catch (error) {
      console.error('Error adding staff:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.detail || error.message;
      setError('Failed to add staff: ' + errorMsg);
      toast.error('Failed to add staff: ' + errorMsg, { autoClose: 3000 });
    }
  };

  // Handle editing a staff member
  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    setNewStaff({
      name: staff.name || '',
      department: staff.department || '',
      email: staff.email || '',
    });
    const dept = departments.find((d) => d.id === staff.department);
    setDeptSearch(dept ? dept.name : '');
    setShowDeptDropdown(false);
    setError('');
  };

  // Handle updating a staff member
  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    if (!editingStaff) return;
    if (!newStaff.name || !newStaff.department || !newStaff.email) {
      setError('All fields are required');
      toast.error('All fields are required', { autoClose: 3000 });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStaff.email)) {
      setError('Please enter a valid email address');
      toast.error('Please enter a valid email address', { autoClose: 3000 });
      return;
    }
    setError('');
    try {
      const response = await axios.put(`${API_BASE_URL}/staff/${editingStaff.id}/`, newStaff, {
        headers: { 'Content-Type': 'application/json' },
      });
      setStaffList(staffList.map((staff) => (staff.id === editingStaff.id ? response.data : staff)));
      setEditingStaff(null);
      setNewStaff({ name: '', department: '', email: '' });
      setDeptSearch('');
      setShowDeptDropdown(false);
      toast.success('Staff updated successfully!', { autoClose: 2000 });
    } catch (error) {
      console.error('Error updating staff:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.detail || error.message;
      setError('Failed to update staff: ' + errorMsg);
      toast.error('Failed to update staff: ' + errorMsg, { autoClose: 3000 });
    }
  };

  // Handle deleting a staff member with confirmation
  const handleDeleteStaff = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${name || 'this staff'}?`);
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/staff/${id}/`);
        setStaffList(staffList.filter((staff) => staff.id !== id));
        toast.success('Staff deleted successfully!', { autoClose: 2000 });
      } catch (error) {
        console.error('Error deleting staff:', error);
        const errorMsg = error.response?.data?.detail || error.message;
        setError('Failed to delete staff: ' + errorMsg);
        toast.error('Failed to delete staff: ' + errorMsg, { autoClose: 3000 });
      }
    }
  };

  // Handle viewing staff details
  const handleViewDetails = (staff) => {
    setSelectedStaff(staff);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedStaff(null);
  };

  // Handle form submission (add or update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStaff) {
      handleUpdateStaff(e);
    } else {
      handleAddStaff(e);
    }
  };

  // Filter departments based on search term, use top 3 if search is empty
  const filteredDepartments = deptSearch
    ? departments.filter((dept) =>
        dept.name?.toLowerCase().includes(deptSearch.toLowerCase())
      )
    : departments.sort((a, b) => b.id - a.id).slice(0, 3);

  // Handle department selection
  const handleDeptSelect = (dept) => {
    setNewStaff({ ...newStaff, department: dept.id });
    setDeptSearch(dept.name);
    setShowDeptDropdown(false);
  };

  // Filter staff based on search term
  const filteredStaff = staffList.filter((staff) => {
    const departmentName =
      staff.department_name ||
      (departments.find((d) => d.id === staff.department)?.name) ||
      '';
    const name = staff.name || '';
    const email = staff.email || '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Staff Management</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-2xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newStaff.name}
            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
            className="p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400"
            required
          />
          <div className="relative">
            <input
              type="text"
              placeholder="Search Department..."
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
                  <li className="p-3 text-gray-500">No departments found</li>
                )}
              </ul>
            )}
          </div>
          <input
            type="email"
            placeholder="Email"
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
          {editingStaff ? 'Update Staff' : 'Add Staff'}
        </button>
      </form>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name, role, department, or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/3 p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-gray-400 mb-6"
      />
      <div className="bg-white rounded-xl shadow-2xl overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-gray-700 font-semibold">ID</th>
              <th className="p-3 text-left text-gray-700 font-semibold">Name</th>
              <th className="p-3 text-left text-gray-700 font-semibold">Department</th>
              <th className="p-3 text-left text-gray-700 font-semibold">Email</th>
              <th className="p-3 text-left text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staff) => (
              <tr key={staff.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{staff.id}</td>
                <td className="p-3">{staff.name || 'N/A'}</td>
                <td className="p-3">
                  {staff.department_name ||
                    (departments.find((d) => d.id === staff.department)?.name) ||
                    'N/A'}
                </td>
                <td className="p-3">{staff.email || 'N/A'}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleViewDetails(staff)}
                    className="text-blue-600 mr-4 hover:underline font-medium"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDeleteStaff(staff.id, staff.name)}
                    className="text-red-600 hover:underline font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Staff Details */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-extrabold text-gray-800 mb-6">Staff Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700">ID:</p>
                  <p className="text-gray-600">{selectedStaff.id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">First Name:</p>
                  <p className="text-gray-600">{selectedStaff.first_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Middle Name:</p>
                  <p className="text-gray-600">{selectedStaff.middle_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Last Name:</p>
                  <p className="text-gray-600">{selectedStaff.last_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Full Name:</p>
                  <p className="text-gray-600">{selectedStaff.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Username:</p>
                  <p className="text-gray-600">{selectedStaff.username || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Email:</p>
                  <p className="text-gray-600">{selectedStaff.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Department:</p>
                  <p className="text-gray-600">
                    {selectedStaff.department_name ||
                      (departments.find((d) => d.id === selectedStaff.department)?.name) ||
                      'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Date of Birth:</p>
                  <p className="text-gray-600">{selectedStaff.dob || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Location (Latitude):</p>
                  <p className="text-gray-600">{selectedStaff.location_lat || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Location (Longitude):</p>
                  <p className="text-gray-600">{selectedStaff.location_lng || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-gray-700">Location Address:</p>
                  <p className="text-gray-600">{selectedStaff.location_address || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Profile Picture:</p>
                  {selectedStaff.profile_picture ? (
                    <a
                      href={selectedStaff.profile_picture}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Profile Picture
                    </a>
                  ) : (
                    <p className="text-gray-600">N/A</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">CV:</p>
                  {selectedStaff.cv ? (
                    <a
                      href={selectedStaff.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View CV
                    </a>
                  ) : (
                    <p className="text-gray-600">N/A</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Certificate Type:</p>
                  <p className="text-gray-600">{selectedStaff.certificate_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Certificate Title:</p>
                  <p className="text-gray-600">{selectedStaff.certificate_title || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-gray-700">Certificate Description:</p>
                  <p className="text-gray-600">{selectedStaff.certificate_description || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Certificate Issue Date:</p>
                  <p className="text-gray-600">{selectedStaff.certificate_issue_date || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Certificate File:</p>
                  {selectedStaff.certificate_file ? (
                    <a
                      href={selectedStaff.certificate_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Certificate
                    </a>
                  ) : (
                    <p className="text-gray-600">N/A</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="p-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition font-semibold"
              >
                Close
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