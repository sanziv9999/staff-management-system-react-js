import React, { useState } from 'react'; // Removed useEffect since it's not needed
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

function App() {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    return storedToken || null;
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('is_admin') === 'true';
  });

  const handleLogout = () => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('is_admin');
  };

  const PrivateRoute = ({ children, adminOnly = false }) => {
    if (!token) {
      return <Navigate to="/login" />;
    }
    if (adminOnly && !isAdmin) {
      return <Navigate to="/user-dashboard" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="flex flex-col h-screen">
        {token && <Navbar onLogout={handleLogout} isAdmin={isAdmin} />}
        <div className="flex flex-1 overflow-hidden">
          {token && isAdmin && <Sidebar onLogout={handleLogout} />}
          <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
            <Routes>
              <Route
                path="/login"
                element={<Login setToken={setToken} setIsAdmin={setIsAdmin} />}
              />
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
              <Route
                path="/user-dashboard"
                element={
                  <PrivateRoute>
                    <UserDashboard token={token} isAdmin={isAdmin} />
                  </PrivateRoute>
                }
              />
              <Route
                path="*"
                element={
                  <Navigate to={token ? (isAdmin ? '/' : '/user-dashboard') : '/login'} />
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