import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./components/AdminLogin.jsx";
import AdminDashboard from "./components/AdminDashboard";
import PoliceDashboard from "./components/PoliceDashboard";

import { ToastContainer } from 'react-toastify';

const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated"); // Check login state
  return isAuthenticated ? element : <Navigate to="/" />; // Redirect if not logged in
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handle successful login
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true"); // Save in localStorage
  };

  return (
    <Routes>
      <Route path="/" element={<AdminLogin onLogin={handleLogin} />} />
      <Route path="/dashboard" element={<PrivateRoute element={<AdminDashboard />} />} />
      <Route path="/PoliceDashboard" element={<PoliceDashboard />} />
    </Routes>
  );
}

export default App;
