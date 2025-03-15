import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newStaff, setNewStaff] = useState({ name: '', role: '', department: '', email: '' });
  const [editingStaff, setEditingStaff] = useState(null);
  const [deptSearch, setDeptSearch] = useState('');
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search
  const [error, setError] = useState(''); // For error messages

  // Fetch staff and departments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffResponse, deptResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/staff/'),
          axios.get('http://localhost:8000/api/departments/')
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

  // Handle adding a new staff member
  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.role || !newStaff.department || !newStaff.email) {
      setError('All fields are required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStaff.email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/staff/', newStaff, {
        headers: { 'Content-Type': 'application/json' },
      });
      setStaffList([...staffList, response.data]);
      setNewStaff({ name: '', role: '', department: '', email: '' });
      setDeptSearch('');
      setShowDeptDropdown(false);
    } catch (error) {
      console.error('Error adding staff:', error.response?.data || error.message);
      setError('Failed to add staff: ' + (error.response?.data?.detail || error.message));
    }
  };

  // Handle editing a staff member
  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    setNewStaff({
      name: staff.name,
      role: staff.role,
      department: staff.department, // Should be ID
      email: staff.email
    });
    // Set department search to the name for display
    const dept = departments.find(d => d.id === staff.department);
    setDeptSearch(dept ? dept.name : '');
    setShowDeptDropdown(false);
    setError('');
  };

  // Handle updating a staff member
  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    if (!editingStaff) return;
    if (!newStaff.name || !newStaff.role || !newStaff.department || !newStaff.email) {
      setError('All fields are required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStaff.email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    try {
      const response = await axios.put(`http://localhost:8000/api/staff/${editingStaff.id}/`, newStaff, {
        headers: { 'Content-Type': 'application/json' },
      });
      setStaffList(staffList.map(staff => staff.id === editingStaff.id ? response.data : staff));
      setEditingStaff(null);
      setNewStaff({ name: '', role: '', department: '', email: '' });
      setDeptSearch('');
      setShowDeptDropdown(false);
    } catch (error) {
      console.error('Error updating staff:', error.response?.data || error.message);
      setError('Failed to update staff: ' + (error.response?.data?.detail || error.message));
    }
  };

  // Handle deleting a staff member with confirmation
  const handleDeleteStaff = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${name}?`);
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/staff/${id}/`);
        setStaffList(staffList.filter(staff => staff.id !== id));
      } catch (error) {
        console.error('Error deleting staff:', error);
        setError('Failed to delete staff: ' + (error.response?.data?.detail || error.message));
      }
    }
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
    ? departments.filter(dept => dept.name.toLowerCase().includes(deptSearch.toLowerCase()))
    : departments.sort((a, b) => b.id - a.id).slice(0, 3); // Top 3 by descending ID (simulating recency)

  // Handle department selection
  const handleDeptSelect = (dept) => {
    setNewStaff({ ...newStaff, department: dept.id });
    setDeptSearch(dept.name);
    setShowDeptDropdown(false);
  };

  // Filter staff based on search term
  const filteredStaff = staffList.filter(staff => {
    const departmentName = staff.department_name || (departments.find(d => d.id === staff.department)?.name) || '';
    return (
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Staff Management</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newStaff.name}
            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Role"
            value={newStaff.role}
            onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
            className="p-2 border rounded"
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
              onBlur={() => setTimeout(() => setShowDeptDropdown(false), 200)} // Delay to allow click
              className="p-2 border rounded w-full"
              required
            />
            {showDeptDropdown && (
              <ul className="absolute z-10 bg-white border rounded shadow max-h-40 overflow-y-auto w-full">
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((dept) => (
                    <li
                      key={dept.id}
                      onClick={() => handleDeptSelect(dept)}
                      onMouseDown={(e) => e.preventDefault()} // Prevent onBlur from closing
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {dept.name}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">No departments found</li>
                )}
              </ul>
            )}
          </div>
          <input
            type="email"
            placeholder="Email"
            value={newStaff.email}
            onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
            className="p-2 border rounded"
            required
          />
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
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
        className="w-full md:w-1/3 p-2 border rounded mb-4"
      />
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Department</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staff) => (
              <tr key={staff.id} className="border-t">
                <td className="p-2">{staff.name}</td>
                <td className="p-2">{staff.role}</td>
                <td className="p-2">{staff.department_name || (departments.find(d => d.id === staff.department)?.name) || 'N/A'}</td>
                <td className="p-2">{staff.email}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEditStaff(staff)}
                    className="text-blue-600 mr-2 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStaff(staff.id, staff.name)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
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

export default Staff;