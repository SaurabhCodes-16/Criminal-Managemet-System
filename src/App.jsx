import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./components/AdminLogin.jsx";
import AdminDashboard from "./components/AdminDashboard";
import PoliceDashboard from "./components/PoliceDashboard";

import { ToastContainer } from 'react-toastify';
import AddCriminal from "./components/addcriminal.jsx";
import CriminalList from "./components/criminallist.jsx";
import ViewCrimes from "./components/viewcrimes.jsx";
import PoliceOfficers from "./components/Policeofficers.jsx";
import CourtCases from "./components/CourtCases.jsx";
import Evidences from "./components/Evidences.jsx";
import PrisonersPage from "./components/PrisonersPage.jsx";
import ManageUsers from "./components/Manageusers.jsx";

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
      <Route path="/add" element={<AddCriminal/>}/>
      <Route path ="/delete" element={<CriminalList/>}/>
      <Route path ="/viewcrimes" element={<ViewCrimes/>}/>
      <Route path ="/viewPolice" element={<PoliceOfficers/>}/> 
      <Route path = "/cases" element={<CourtCases/>}/>
      <Route path = "/evidences" element={<Evidences/>}/> 
      <Route path = "/prisoners" element={<PrisonersPage/>}/>
      <Route path = "/users" element={<ManageUsers/>}/>
    </Routes>
  );
}

export default App;
