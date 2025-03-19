import React, { useState } from 'react';
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
import UserDashboard from './pages/UserDashboard';
import StaffLogin from './authentication/StaffLogin';
import StaffRegistration from './authentication/StaffRegistration';

function App() {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    return storedToken || null;
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('is_admin') === 'true';
  });
  const [isStaff, setIsStaff] = useState(() => {
    return localStorage.getItem('is_staff') === 'true';
  });

  const handleLogout = () => {
    setToken(null);
    setIsAdmin(false);
    setIsStaff(false);
    localStorage.removeItem('token');
    localStorage.removeItem('is_admin');
    localStorage.removeItem('is_staff');
    localStorage.removeItem('staff_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('department');
  };

  const PrivateRoute = ({ children, adminOnly = false, staffOnly = false }) => {
    if (!token) {
      return <Navigate to="/staff-login" />;  // Changed default redirect to staff-login
    }
    if (adminOnly && !isAdmin) {
      return <Navigate to="/user-dashboard" />;
    }
    if (staffOnly && !isStaff) {
      return <Navigate to="/staff-login" />;  // Changed redirect to staff-login
    }
    return children;
  };

  return (
    <Router>
      <div className="flex flex-col h-screen">
        {token && <Navbar onLogout={handleLogout} isAdmin={isAdmin} isStaff={isStaff} />}
        <div className="flex flex-1 overflow-hidden">
          {token && isAdmin && <Sidebar onLogout={handleLogout} />}
          <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
            <Routes>
              {/* Authentication Routes */}
              <Route 
                path="/staff-login" 
                element={
                  token && isStaff ? 
                  <Navigate to="/staff-dashboard" /> : 
                  <StaffLogin setToken={setToken} setIsStaff={setIsStaff} />
                } 
              />
              <Route 
                path="/staff-registration" 
                element={
                  token && isStaff ? 
                  <Navigate to="/staff-dashboard" /> : 
                  <StaffRegistration setToken={setToken} setIsStaff={setIsStaff} />
                } 
              />
              <Route
                path="/login"
                element={
                  token ? 
                  <Navigate to={isAdmin ? "/dashboard" : "/user-dashboard"} /> : 
                  <Login setToken={setToken} setIsAdmin={setIsAdmin} />
                }
              />

              {/* Admin Routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute adminOnly={true}>
                    <Dashboard token={token} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/staff"
                element={
                  <PrivateRoute adminOnly={true}>
                    <Staff token={token} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/department"
                element={
                  <PrivateRoute adminOnly={true}>
                    <Department token={token} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/schedule"
                element={
                  <PrivateRoute adminOnly={true}>
                    <Schedule token={token} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute adminOnly={true}>
                    <Settings token={token} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/salary"
                element={
                  <PrivateRoute adminOnly={true}>
                    <SalaryDetails token={token} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/attendance"
                element={
                  <PrivateRoute adminOnly={true}>
                    <Attendance token={token} />
                  </PrivateRoute>
                }
              />

              {/* User/Staff Routes */}
              <Route
                path="/user-dashboard"
                element={
                  <PrivateRoute>
                    <UserDashboard token={token} isAdmin={isAdmin} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/staff-dashboard"
                element={
                  <PrivateRoute staffOnly={true}>
                    <UserDashboard token={token} isStaff={isStaff} />
                  </PrivateRoute>
                }
              />

              {/* Default Route (Root path) */}
              <Route 
                path="/" 
                element={<Navigate to="/staff-login" />} 
              />

              {/* Fallback Route */}
              <Route
                path="*"
                element={
                  <Navigate to={
                    token ? 
                      (isAdmin ? '/' : isStaff ? '/staff-dashboard' : '/user-dashboard') 
                      : '/staff-login'  // Changed default redirect to staff-login
                  } />
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;