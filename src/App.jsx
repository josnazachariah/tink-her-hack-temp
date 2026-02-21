import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Auth from './components/Auth';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null); // null, { role: 'admin'|'user', email }

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('cityTrackerUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cityTrackerUser');
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar user={user} onLogout={handleLogout} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Hero user={user} />} />

            <Route path="/login" element={
              !user ? <Auth onLogin={handleLogin} /> : (
                user.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />
              )
            } />

            <Route path="/dashboard" element={
              user?.role === 'user' ? <UserDashboard user={user} /> : <Navigate to="/login" replace />
            } />

            <Route path="/admin" element={
              user?.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/login" replace />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
