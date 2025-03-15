import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Staff from './pages/Staff';
import Department from './pages/Department';
import Schedule from './pages/Schedule';
import Settings from './pages/Settings';
import SalaryDetails from './pages/SalaryDetails';
import Attendance from './pages/Attendance';
import Login from './authentication/Login';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Sync token state with localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      setToken(storedToken);
    }
  }, [token]);

  // Handle logout
  const handleLogout = () => {
    setToken(null); // Reset token state
    localStorage.removeItem('token'); // Remove token from localStorage
    // No need to navigate here; let the PrivateRoute handle redirection
  };

  // PrivateRoute component to protect routes
  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="flex flex-col h-screen">
        {token && <Navbar onLogout={handleLogout} />}
        <div className="flex flex-1 overflow-hidden">
          {token && <Sidebar onLogout={handleLogout} />}
          <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
            <Routes>
              <Route path="/login" element={<Login setToken={setToken} />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard token={token} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/staff"
                element={
                  <PrivateRoute>
                    <Staff token={token} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/department"
                element={
                  <PrivateRoute>
                    <Department token={token} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/schedule"
                element={
                  <PrivateRoute>
                    <Schedule token={token} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings token={token} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/salary"
                element={
                  <PrivateRoute>
                    <SalaryDetails token={token} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/attendance"
                element={
                  <PrivateRoute>
                    <Attendance token={token} />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to={token ? '/' : '/login'} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;