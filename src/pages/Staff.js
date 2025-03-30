import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';

function Staff() {
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
  const [deptSearch, setDeptSearch] = useState('');
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffResponse, deptResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/staff/`),
          axios.get(`${API_BASE_URL}/departments/`),
        ]);
        setStaffList(staffResponse.data);
        setDepartments(deptResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please ensure the backend server is running.');
      }
    };
    fetchData();
  }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.first_name || !newStaff.last_name || !newStaff.email || !newStaff.department) {
      setError('Required fields (First Name, Last Name, Email, Department) are missing');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStaff.email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/staff/`, newStaff, {
        headers: { 'Content-Type': 'application/json' },
      });
      setStaffList([...staffList, response.data]);
      resetForm();
    } catch (error) {
      console.error('Error adding staff:', error.response?.data || error.message);
      setError('Failed to add staff: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    setNewStaff({
      first_name: staff.first_name,
      middle_name: staff.middle_name || '',
      last_name: staff.last_name,
      username: staff.username || '',
      email: staff.email,
      department: staff.department,
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
      setError('Required fields (First Name, Last Name, Email, Department) are missing');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStaff.email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    try {
      const response = await axios.put(`${API_BASE_URL}/staff/${editingStaff.id}/`, newStaff, {
        headers: { 'Content-Type': 'application/json' },
      });
      setStaffList(staffList.map((staff) => (staff.id === editingStaff.id ? response.data : staff)));
      resetForm();
    } catch (error) {
      console.error('Error updating staff:', error.response?.data || error.message);
      setError('Failed to update staff: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDeleteStaff = async (id, first_name, last_name) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${first_name} ${last_name}?`);
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/staff/${id}/`);
        setStaffList(staffList.filter((staff) => staff.id !== id));
      } catch (error) {
        console.error('Error deleting staff:', error);
        setError('Failed to delete staff: ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const resetForm = () => {
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
    ? departments.filter((dept) => dept.name.toLowerCase().includes(deptSearch.toLowerCase()))
    : departments.sort((a, b) => b.id - a.id).slice(0, 3);

  const handleDeptSelect = (dept) => {
    setNewStaff({ ...newStaff, department: dept.id });
    setDeptSearch(dept.name);
    setShowDeptDropdown(false);
  };

  const filteredStaff = staffList.filter((staff) => {
    const departmentName = departments.find((d) => d.id === staff.department)?.name || '';
    const fullName = `${staff.first_name} ${staff.last_name}`;
    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.location_address || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleViewDetails = (staff) => {
    setSelectedStaff(staff);
  };

  const closeModal = () => {
    setSelectedStaff(null);
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Staff Management</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Form inputs remain the same */}
          <input type="text" placeholder="First Name" value={newStaff.first_name} onChange={(e) => setNewStaff({ ...newStaff, first_name: e.target.value })} className="p-2 border rounded" required />
          <input type="text" placeholder="Middle Name" value={newStaff.middle_name} onChange={(e) => setNewStaff({ ...newStaff, middle_name: e.target.value })} className="p-2 border rounded" />
          <input type="text" placeholder="Last Name" value={newStaff.last_name} onChange={(e) => setNewStaff({ ...newStaff, last_name: e.target.value })} className="p-2 border rounded" required />
          <input type="text" placeholder="Username" value={newStaff.username} onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })} className="p-2 border rounded" />
          <input type="email" placeholder="Email" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} className="p-2 border rounded" required />
          <div className="relative">
            <input type="text" placeholder="Search Department..." value={deptSearch} onChange={(e) => { setDeptSearch(e.target.value); setShowDeptDropdown(true); }} onFocus={() => setShowDeptDropdown(true)} onBlur={() => setTimeout(() => setShowDeptDropdown(false), 200)} className="p-2 border rounded w-full" required />
            {showDeptDropdown && (
              <ul className="absolute z-10 bg-white border rounded shadow max-h-40 overflow-y-auto w-full">
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((dept) => (
                    <li key={dept.id} onClick={() => handleDeptSelect(dept)} onMouseDown={(e) => e.preventDefault()} className="p-2 hover:bg-gray-100 cursor-pointer">
                      {dept.name}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">No departments found</li>
                )}
              </ul>
            )}
          </div>
          <input type="date" placeholder="Date of Birth" value={newStaff.dob} onChange={(e) => setNewStaff({ ...newStaff, dob: e.target.value })} className="p-2 border rounded" />
          <input type="number" placeholder="Latitude" value={newStaff.location_lat} onChange={(e) => setNewStaff({ ...newStaff, location_lat: e.target.value })} className="p-2 border rounded" step="any" />
          <input type="number" placeholder="Longitude" value={newStaff.location_lng} onChange={(e) => setNewStaff({ ...newStaff, location_lng: e.target.value })} className="p-2 border rounded" step="any" />
          <input type="text" placeholder="Location Address" value={newStaff.location_address} onChange={(e) => setNewStaff({ ...newStaff, location_address: e.target.value })} className="p-2 border rounded" />
          <input type="text" placeholder="Certificate Type" value={newStaff.certificate_type} onChange={(e) => setNewStaff({ ...newStaff, certificate_type: e.target.value })} className="p-2 border rounded" />
          <input type="text" placeholder="Certificate Title" value={newStaff.certificate_title} onChange={(e) => setNewStaff({ ...newStaff, certificate_title: e.target.value })} className="p-2 border rounded" />
          <textarea placeholder="Certificate Description" value={newStaff.certificate_description} onChange={(e) => setNewStaff({ ...newStaff, certificate_description: e.target.value })} className="p-2 border rounded" />
          <input type="date" placeholder="Certificate Issue Date" value={newStaff.certificate_issue_date} onChange={(e) => setNewStaff({ ...newStaff, certificate_issue_date: e.target.value })} className="p-2 border rounded" />
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <button type="submit" className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {editingStaff ? 'Update Staff' : 'Add Staff'}
        </button>
      </form>

      <input type="text" placeholder="Search by name, department, email, or address..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-1/3 p-2 border rounded mb-4" />

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Full Name</th>
              <th className="p-2 text-left">Department</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staff) => (
              <tr key={staff.id} className="border-t">
                <td className="p-2">{`${staff.first_name} ${staff.middle_name ? staff.middle_name + ' ' : ''}${staff.last_name}`}</td>
                <td className="p-2">{departments.find((d) => d.id === staff.department)?.name || 'N/A'}</td>
                <td className="p-2">{staff.email}</td>
                <td className="p-2">{staff.location_address || 'N/A'}</td>
                <td className="p-2">
                  <button onClick={() => handleViewDetails(staff)} className="text-green-600 mr-2 hover:underline">View</button>
                  <button onClick={() => handleEditStaff(staff)} className="text-blue-600 mr-2 hover:underline">Edit</button>
                  <button onClick={() => handleDeleteStaff(staff.id, staff.first_name, staff.last_name)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStaff && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={closeModal}>
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Staff Details</h3>
              <div className="mt-2 px-7 py-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Full Name:</strong> {`${selectedStaff.first_name} ${selectedStaff.middle_name ? selectedStaff.middle_name + ' ' : ''}${selectedStaff.last_name}`}</p>
                    <p><strong>Username:</strong> {selectedStaff.username || 'N/A'}</p>
                    <p><strong>Email:</strong> {selectedStaff.email}</p>
                    <p><strong>Department:</strong> {departments.find((d) => d.id === selectedStaff.department)?.name || 'N/A'}</p>
                    <p><strong>Date of Birth:</strong> {selectedStaff.dob || 'N/A'}</p>
                    <p><strong>Location:</strong> {selectedStaff.location_address || 'N/A'}</p>
                    <p><strong>Coordinates:</strong> {selectedStaff.location_lat && selectedStaff.location_lng ? `${selectedStaff.location_lat}, ${selectedStaff.location_lng}` : 'N/A'}</p>
                  </div>
                  <div>
                    <p><strong>Certificate Type:</strong> {selectedStaff.certificate_type || 'N/A'}</p>
                    <p><strong>Certificate Title:</strong> {selectedStaff.certificate_title || 'N/A'}</p>
                    <p><strong>Certificate Description:</strong> {selectedStaff.certificate_description || 'N/A'}</p>
                    <p><strong>Certificate Issue Date:</strong> {selectedStaff.certificate_issue_date || 'N/A'}</p>
                    {selectedStaff.profile_picture && (
                      <div className="mt-2">
                        <p><strong>Profile Picture:</strong></p>
                        <img src={selectedStaff.profile_picture} alt="Profile" className="max-w-full h-auto rounded" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  {selectedStaff.cv && (
                    <p><strong>CV:</strong> <a href={selectedStaff.cv} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View CV</a></p>
                  )}
                  {selectedStaff.certificate_file && (
                    <p><strong>Certificate File:</strong> <a href={selectedStaff.certificate_file} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Certificate</a></p>
                  )}
                </div>
              </div>
              <div className="items-center px-4 py-3">
                <button onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Staff;