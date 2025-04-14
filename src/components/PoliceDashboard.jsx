import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserTie, FaGavel, FaFingerprint, FaSignOutAlt,
  FaDatabase, FaMoon, FaSun, FaTimes, FaPlusCircle
} from "react-icons/fa";
import Particles from "react-tsparticles";
import axios from "axios";
import "./styles.css";

const PoliceDashboard = () => {
  const navigate = useNavigate();
  const officerName = localStorage.getItem("adminUsername") || "Officer";

  const [darkMode, setDarkMode] = useState(false);
  const [showCriminalForm, setShowCriminalForm] = useState(false);
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);

  const [newCriminal, setNewCriminal] = useState({ name: "", crime: "" });
  const [newEvidence, setNewEvidence] = useState({ caseID: "", description: "" });
  const [message, setMessage] = useState("");

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.clear();
    alert("Successfully logged out!");
    navigate("/");
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("role");
    if (!isAuthenticated || role !== "police") {
      navigate("/");
    }
  }, [navigate]);

  const handleAddCriminal = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/api/criminals", newCriminal);
      setMessage(res.data.message);
      setNewCriminal({ name: "", crime: "" });
    } catch {
      setMessage("Error adding criminal.");
    }
  };

  const handleAddEvidence = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/api/evidence", newEvidence);
      setMessage(res.data.message);
      setNewEvidence({ caseID: "", description: "" });
    } catch {
      setMessage("Error adding evidence.");
    }
  };

  return (
    <div className={darkMode ? "dashboard dark-mode" : "dashboard"}>
      <Particles options={{ particles: { number: { value: 80 }, color: { value: "#00ff99" }, size: { value: 2 }}}}
        style={{ position: "absolute", width: "100%", height: "100%", zIndex: -1 }}
      />

      <div className="logged-in-user">👮 Logged in as: <strong>{officerName}</strong></div>

      <button onClick={toggleDarkMode} className="dark-mode-button">
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <h1 className="glitch">Police Investigation Portal</h1>

      <div className="button-container">
        <button className="glitch-button" onClick={() => setShowCriminalForm(!showCriminalForm)}>
          <FaUserTie /> Manage Criminals
        </button>
        <button className="glitch-button alert" onClick={() => navigate("/crimes")}>
          <FaGavel /> View Crimes
        </button>
        <button className="glitch-button" onClick={() => navigate("/forensics")}>
          <FaFingerprint /> Forensic Reports
        </button>
        <button className="glitch-button" onClick={() => setShowEvidenceForm(!showEvidenceForm)}>
          <FaDatabase /> Crime Scene Evidence
        </button>
      </div>

      <div className="logout-container">
        <button className="glitch-button logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Criminal Form */}
      <div className={`slide-down-form ${showCriminalForm ? "open" : ""}`}>
        {showCriminalForm && (
          <div className="form-content">
            <h3>Add Criminal</h3>
            <form onSubmit={handleAddCriminal}>
              <input type="text" placeholder="Name" value={newCriminal.name} onChange={(e) => setNewCriminal({ ...newCriminal, name: e.target.value })} required />
              <input type="text" placeholder="Crime" value={newCriminal.crime} onChange={(e) => setNewCriminal({ ...newCriminal, crime: e.target.value })} required />
              <button type="submit"><FaPlusCircle /> Add</button>
            </form>
            <button className="close-button" onClick={() => setShowCriminalForm(false)}><FaTimes /> Close</button>
          </div>
        )}
      </div>

      {/* Evidence Form */}
      <div className={`slide-down-form ${showEvidenceForm ? "open" : ""}`}>
        {showEvidenceForm && (
          <div className="form-content">
            <h3>Add Evidence</h3>
            <form onSubmit={handleAddEvidence}>
              <input type="text" placeholder="Case ID" value={newEvidence.caseID} onChange={(e) => setNewEvidence({ ...newEvidence, caseID: e.target.value })} required />
              <input type="text" placeholder="Description" value={newEvidence.description} onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })} required />
              <button type="submit"><FaPlusCircle /> Add</button>
            </form>
            <button className="close-button" onClick={() => setShowEvidenceForm(false)}><FaTimes /> Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliceDashboard;
