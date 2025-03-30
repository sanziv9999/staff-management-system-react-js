import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../api';

// Translation dictionary
const translations = {
  en: {
    title: "Update Settings",
    companyName: "Company Name",
    workingHours: "Working Hours",
    currency: "Currency",
    overtimeRate: "Overtime Rate",
    updateBtn: "Update Settings",
    requiredFields: "All fields are required.",
    invalidOvertime: "Overtime rate must be greater than 0.",
    updateSuccess: "Settings updated successfully!",
    updateError: "Failed to update settings",
    loading: "Loading settings...",
    loginRequired: "Please log in to access this page.",
    currencies: [
      'USD-$', 'EUR-€', 'JPY-¥', 'GBP-£', 'CNY-¥', 'INR-₹', 'NPR-₨', 'CAD-$', 'AUD-$',
      'CHF-₣', 'HKD-$', 'SGD-$', 'SEK-kr', 'NOK-kr', 'DKK-kr', 'NZD-$', 'MXN-$', 'BRL-R$',
      'ZAR-R', 'KRW-₩'
    ]
  },
  ja: {
    title: "設定を更新",
    companyName: "会社名",
    workingHours: "勤務時間",
    currency: "通貨",
    overtimeRate: "残業料金",
    updateBtn: "設定を更新",
    requiredFields: "すべてのフィールドが必要です。",
    invalidOvertime: "残業料金は0より大きい必要があります。",
    updateSuccess: "設定が正常に更新されました！",
    updateError: "設定の更新に失敗しました",
    loading: "設定を読み込み中...",
    loginRequired: "このページにアクセスするにはログインしてください。",
    currencies: [
      'USD-＄', 'EUR-€', 'JPY-¥', 'GBP-£', 'CNY-¥', 'INR-₹', 'NPR-₨', 'CAD-＄', 'AUD-＄',
      'CHF-₣', 'HKD-＄', 'SGD-＄', 'SEK-kr', 'NOK-kr', 'DKK-kr', 'NZD-＄', 'MXN-＄', 'BRL-R＄',
      'ZAR-R', 'KRW-₩'
    ]
  },
  ne: {
    title: "सेटिङहरू अपडेट गर्नुहोस्",
    companyName: "कम्पनीको नाम",
    workingHours: "कार्य घण्टा",
    currency: "मुद्रा",
    overtimeRate: "अतिरिक्त समय दर",
    updateBtn: "सेटिङहरू अपडेट गर्नुहोस्",
    requiredFields: "सबै फिल्डहरू आवश्यक छन्।",
    invalidOvertime: "अतिरिक्त समय दर ० भन्दा बढी हुनुपर्छ।",
    updateSuccess: "सेटिङहरू सफलतापूर्वक अपडेट भयो!",
    updateError: "सेटिङहरू अपडेट गर्न असफल भयो",
    loading: "सेटिङहरू लोड गर्दै...",
    loginRequired: "यो पृष्ठ पहुँच गर्न कृपया लगइन गर्नुहोस्।",
    currencies: [
      'USD-$', 'EUR-€', 'JPY-¥', 'GBP-£', 'CNY-¥', 'INR-₹', 'NPR-रु', 'CAD-$', 'AUD-$',
      'CHF-₣', 'HKD-$', 'SGD-$', 'SEK-kr', 'NOK-kr', 'DKK-kr', 'NZD-$', 'MXN-$', 'BRL-R$',
      'ZAR-R', 'KRW-₩'
    ]
  },
  hi: {
    title: "सेटिंग अपडेट करें",
    companyName: "कंपनी का नाम",
    workingHours: "कार्य घंटे",
    currency: "मुद्रा",
    overtimeRate: "ओवरटाइम दर",
    updateBtn: "सेटिंग अपडेट करें",
    requiredFields: "सभी फ़ील्ड आवश्यक हैं।",
    invalidOvertime: "ओवरटाइम दर 0 से अधिक होनी चाहिए।",
    updateSuccess: "सेटिंग सफलतापूर्वक अपडेट हो गई!",
    updateError: "सेटिंग अपडेट करने में विफल",
    loading: "सेटिंग लोड हो रही है...",
    loginRequired: "इस पेज तक पहुंचने के लिए कृपया लॉगिन करें।",
    currencies: [
      'USD-$', 'EUR-€', 'JPY-¥', 'GBP-£', 'CNY-¥', 'INR-₹', 'NPR-रु', 'CAD-$', 'AUD-$',
      'CHF-₣', 'HKD-$', 'SGD-$', 'SEK-kr', 'NOK-kr', 'DKK-kr', 'NZD-$', 'MXN-$', 'BRL-R$',
      'ZAR-R', 'KRW-₩'
    ]
  }
};

function Settings({ token, setToken }) {
  const [language, setLanguage] = useState('en');
  const [settings, setSettings] = useState({
    id: null,
    companyName: '',
    workingHours: '',
    currency: 'USD-$',
    overtimeRate: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const t = (key) => translations[language][key] || key;

  // Fetch settings
  useEffect(() => {
    if (!token) {
      setError(t('loginRequired'));
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
          setError(t('updateError') + ': ' + (error.response?.data?.detail || error.message));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [token, navigate, setToken, language]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!settings.companyName || !settings.workingHours || !settings.currency || !settings.overtimeRate) {
      setError(t('requiredFields'));
      return;
    }

    if (settings.overtimeRate <= 0) {
      setError(t('invalidOvertime'));
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
      setSuccess(t('updateSuccess'));
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
        setError(t('updateError') + ': ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  if (!token) {
    return <p className="text-red-600">{t('loginRequired')}</p>;
  }

  if (loading) {
    return <p className="text-gray-600">{t('loading')}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <div className="relative">
          <span className="mr-2">Language:</span>
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
      
      <form onSubmit={handleSave} className="bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">{t('companyName')}</label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">{t('workingHours')}</label>
            <input
              type="text"
              value={settings.workingHours}
              onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">{t('currency')}</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              {t('currencies').map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">{t('overtimeRate')}</label>
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
        <button 
          type="submit" 
          className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {t('updateBtn')}
        </button>
      </form>
    </div>
  );
}

export default Settings;