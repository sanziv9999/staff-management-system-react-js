import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../api';

function Settings({ token, setToken }) {
  const [settings, setSettings] = useState({
    id: null,
    companyName: '',
    workingHours: '',
    currency: 'JPY-¥', // Default to JPY
    overtimeRate: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch settings from the backend on mount
  useEffect(() => {
    if (!token) {
      setError('Please log in to access this page.');
      navigate('/login');
      return;
    }

    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/settings/1/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setSettings({
          id: data.id,
          companyName: data.company_name,
          workingHours: data.working_hours,
          currency: data.currency,
          overtimeRate: data.overtime_rate,
        });
      } catch (error) {
        console.error('Error fetching settings:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          setToken(null);
          localStorage.removeItem('token');
          localStorage.removeItem('is_admin');
          navigate('/login');
        } else {
          setError('Failed to load settings: ' + (error.response?.data?.detail || error.message));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [token, navigate, setToken]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate inputs
    if (!settings.companyName || !settings.workingHours || !settings.currency || !settings.overtimeRate) {
      setError('All fields are required.');
      return;
    }

    if (settings.overtimeRate <= 0) {
      setError('Overtime rate must be greater than 0.');
      return;
    }

    const payload = {
      company_name: settings.companyName,
      working_hours: settings.workingHours,
      currency: settings.currency,
      overtime_rate: parseFloat(settings.overtimeRate),
    };

    try {
      const response = await axios.put(`${API_BASE_URL}/settings/1/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Settings updated successfully!');
      setSettings({
        id: response.data.id,
        companyName: response.data.company_name,
        workingHours: response.data.working_hours,
        currency: response.data.currency,
        overtimeRate: response.data.overtime_rate,
      });
    } catch (error) {
      console.error('Error saving settings:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('is_admin');
        navigate('/login');
      } else {
        setError('Failed to update settings: ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  if (!token) {
    return <p className="text-red-600">Please log in to access this page.</p>;
  }

  if (loading) {
    return <p className="text-gray-600">Loading settings...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Update Settings</h2>
      <form onSubmit={handleSave} className="bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Company Name</label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Working Hours</label>
            <input
              type="text"
              value={settings.workingHours}
              onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              {[
                'USD-$', 'EUR-€', 'JPY-¥', 'GBP-£', 'CNY-¥', 'INR-₹', 'NPR-₨', 'CAD-$', 'AUD-$',
                'CHF-₣', 'HKD-$', 'SGD-$', 'SEK-kr', 'NOK-kr', 'DKK-kr', 'NZD-$', 'MXN-$', 'BRL-R$',
                'ZAR-R', 'KRW-₩'
              ].map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Overtime Rate</label>
            <input
              type="number"
              step="0.1"
              value={settings.overtimeRate}
              onChange={(e) => setSettings({ ...settings, overtimeRate: parseFloat(e.target.value) })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
        <button type="submit" className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Update Settings
        </button>
      </form>
    </div>
  );
}

export default Settings;