import React, { useState } from 'react';

function Settings() {
  const [settings, setSettings] = useState({
    companyName: 'ABC Corp',
    workingHours: '9:00 - 17:00',
    currency: 'USD',
    overtimeRate: 1.5
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert('Settings saved!');
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <form onSubmit={handleSave} className="bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block mb-1">Company Name</label><input type="text" value={settings.companyName} onChange={(e) => setSettings({ ...settings, companyName: e.target.value })} className="w-full p-2 border rounded" /></div>
          <div><label className="block mb-1">Working Hours</label><input type="text" value={settings.workingHours} onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })} className="w-full p-2 border rounded" /></div>
          <div><label className="block mb-1">Currency</label><input type="text" value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} className="w-full p-2 border rounded" /></div>
          <div><label className="block mb-1">Overtime Rate</label><input type="number" step="0.1" value={settings.overtimeRate} onChange={(e) => setSettings({ ...settings, overtimeRate: parseFloat(e.target.value) })} className="w-full p-2 border rounded" /></div>
        </div>
        <button type="submit" className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Save Settings</button>
      </form>
    </div>
  );
}

export default Settings;