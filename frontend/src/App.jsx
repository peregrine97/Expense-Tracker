import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './Landing';
import Dashboard from './Dashboard';
import { loginUser, logoutUser } from './api';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('user') !== null;
  });

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      // 1. Send the Google Token to our FastAPI backend
      const userData = await loginUser(credentialResponse.credential);
      console.log("Logged in successfully:", userData);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error("Backend login failed:", error);
      alert("Failed to connect to backend. Is the server running?");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Landing onLoginSuccess={handleLoginSuccess} />
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
