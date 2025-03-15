import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Department() {
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState({ name: '', manager: '', staff_count: '' }); // Changed to string to allow typing
  const [editingDept, setEditingDept] = useState(null);
  const [error, setError] = useState(''); // For error messages
  const [searchTerm, setSearchTerm] = useState(''); // New state for search

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/departments/');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        alert('Failed to load data. Check console for details.');
      }
    };
    fetchDepartments();
  }, []);

  const handleAddDept = async (e) => {
    e.preventDefault();
    // Convert staff_count to integer, validate it's a number
    const staffCount = parseInt(newDept.staff_count);
    if (!newDept.name || !newDept.manager || isNaN(staffCount)) {
      setError('All fields are required, and Staff Count must be a valid number');
      return;
    }
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/departments/', {
        ...newDept,
        staff_count: staffCount, // Ensure staff_count is an integer
      });
      setDepartments([...departments, response.data]);
      setNewDept({ name: '', manager: '', staff_count: '' });
    } catch (error) {
      console.error('Error adding department:', error.response?.data || error.message);
      alert('Failed to add department: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEditDept = (dept) => {
    setEditingDept(dept);
    setNewDept({
      name: dept.name,
      manager: dept.manager,
      staff_count: dept.staff_count.toString(), // Convert to string for input
    });
    setError('');
  };

  const handleUpdateDept = async (e) => {
    e.preventDefault();
    if (!editingDept) return;
    const staffCount = parseInt(newDept.staff_count);
    if (!newDept.name || !newDept.manager || isNaN(staffCount)) {
      setError('All fields are required, and Staff Count must be a valid number');
      return;
    }
    setError('');
    try {
      const response = await axios.put(`http://localhost:8000/api/departments/${editingDept.id}/`, {
        ...newDept,
        staff_count: staffCount, // Ensure staff_count is an integer
      });
      setDepartments(departments.map(dept => dept.id === editingDept.id ? response.data : dept));
      setEditingDept(null);
      setNewDept({ name: '', manager: '', staff_count: '' });
    } catch (error) {
      console.error('Error updating department:', error.response?.data || error.message);
      alert('Failed to update department: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDeleteDept = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${name}?`);
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/departments/${id}/`);
        setDepartments(departments.filter(dept => dept.id !== id));
      } catch (error) {
        console.error('Error deleting department:', error);
        alert('Failed to delete department. Check console for details.');
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

  // Handle input change for staff_count to allow typing
  const handleStaffCountChange = (e) => {
    const value = e.target.value;
    // Allow empty input or numeric values
    if (value === '' || /^\d*$/.test(value)) {
      setNewDept({ ...newDept, staff_count: value });
      setError(''); // Clear error if input is valid
    } else {
      setError('Staff Count must be a valid number');
    }
  };

  // Filter departments based on search term
  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.staff_count.toString().includes(searchTerm)
  );

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Department Management</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Department Name"
            value={newDept.name}
            onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Manager"
            value={newDept.manager}
            onChange={(e) => setNewDept({ ...newDept, manager: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="text" // Changed to text to allow free typing
            placeholder="Staff Count"
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
          {editingDept ? 'Update Department' : 'Add Department'}
        </button>
      </form>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name, manager, or staff count..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/3 p-2 border rounded mb-4"
      />
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Manager</th>
              <th className="p-2 text-left">Staff Count</th>
              <th className="p-2 text-left">Actions</th>
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
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDept(dept.id, dept.name)}
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

export default Department;