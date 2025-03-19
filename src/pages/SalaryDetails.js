import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';

function SalaryDetails({ token }) {
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
  const [currency, setCurrency] = useState('¥'); // Default currency symbol
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSalary, setEditingSalary] = useState(null);
  const [staffSearch, setStaffSearch] = useState('');
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setError('Please log in to access this page.');
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchData = async () => {
      setLoading(true);
      try {
        const settingsRes = await axios.get(`${API_BASE_URL}/settings/1/`);
        const currencySymbol = settingsRes.data.currency.split('-')[1] || '¥'; // Fallback to ¥ if split fails
        setCurrency(currencySymbol);
        const [salariesResponse, staffResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/salaries/`),
          axios.get(`${API_BASE_URL}/staff/`),
        ]);
        setSalaries(salariesResponse.data || []);
        setStaffList(staffResponse.data || []);
        if (!salariesResponse.data || salariesResponse.data.length === 0) {
          setFetchError('No salaries found.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setFetchError('Failed to fetch salaries. Please ensure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

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
      setError('All fields are required, and salary values must be valid numbers');
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
      setError('Failed to add salary: ' + (error.response?.data?.detail || error.message));
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
      setError('All fields are required, and salary values must be valid numbers');
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
      setError('Failed to update salary: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDeleteSalary = async (id, staffName) => {
    const confirmed = window.confirm(`Are you sure you want to delete salary for ${staffName || 'Unknown'}?`);
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/salaries/${id}/`);
        setSalaries(salaries.filter(salary => salary.id !== id));
      } catch (error) {
        console.error('Error deleting salary:', error);
        setError('Failed to delete salary: ' + (error.response?.data?.detail || error.message));
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
    return <p className="text-red-600">Please log in to access this page.</p>;
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Salary Details</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Staff..."
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
                  <li className="p-2 text-gray-500">No staff found</li>
                )}
              </ul>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Base Salary"
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
              placeholder="Bonus"
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
              placeholder="Deductions"
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
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editingSalary ? 'Update Salary' : 'Add Salary'}
        </button>
      </form>
      {loading && <p className="text-gray-600 mb-4">Loading salaries...</p>}
      {fetchError && !loading && <p className="text-red-600 mb-4">{fetchError}</p>}
      {!loading && !fetchError && filteredSalaries.length === 0 && (
        <p className="text-gray-600 mb-4">No salaries available. Add a new salary to get started.</p>
      )}
      <input
        type="text"
        placeholder="Search by name or ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/3 p-2 border rounded mb-4"
      />
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Staff</th>
              <th className="p-2 text-left">Base Salary</th>
              <th className="p-2 text-left">Bonus</th>
              <th className="p-2 text-left">Deductions</th>
              <th className="p-2 text-left">Net Salary</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.map((salary) => (
              <tr key={salary.id} className="border-t">
                <td className="p-2">{salary.staff?.name || 'Unknown'}</td>
                <td className="p-2">{currency}{salary.base_salary}</td>
                <td className="p-2">{currency}{salary.bonus}</td>
                <td className="p-2">{currency}{salary.deductions}</td>
                <td className="p-2">{currency}{calculateNetSalary(salary)}</td>
                <td className="p-2">{salary.payment_date}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded ${salary.status === 'Paid' ? 'bg-green-200' : 'bg-yellow-200'}`}>
                    {salary.status}
                  </span>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleEditSalary(salary)}
                    className="text-blue-600 mr-2 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSalary(salary.id, salary.staff?.name || 'Unknown')}
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

export default SalaryDetails;