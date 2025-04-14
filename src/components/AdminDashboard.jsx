import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserTie, FaGavel, FaUserShield, FaFileAlt,
  FaUsers, FaFingerprint, FaLock, FaSignOutAlt,
  FaDatabase, FaMoon, FaSun, FaTerminal
} from "react-icons/fa";
import Particles from "react-tsparticles";
import "./styles.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const adminUsername = localStorage.getItem("adminUsername") || "Admin";

  const [darkMode, setDarkMode] = useState(false);
  const [hackerMode, setHackerMode] = useState(false);
  const [showCriminalOptions, setShowCriminalOptions] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("adminUsername");
    alert("Successfully logged out!");
    navigate("/");
  };

  // Secret Hacker Mode (Ctrl + Shift + X)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.code === "KeyX") {
        setHackerMode(!hackerMode);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hackerMode]);

  return (
    <div className={darkMode ? "dashboard dark-mode" : "dashboard"}>
      {/* Particle Background */}
      <Particles
        options={{
          particles: {
            number: { value: 100 },
            color: { value: "#ff0000" },
            shape: { type: "circle" },
            opacity: { value: 0.2, anim: { enable: true, speed: 0.5 } },
            size: { value: 2, random: true },
            move: { enable: true, speed: 0.7, direction: "none", outMode: "out" },
          },
        }}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          zIndex: -1,
        }}
      />

      {/* Logged-in Admin Info */}
      <div className="logged-in-user">
        <FaUserShield className="user-icon" /> Logged in as: <strong>{adminUsername}</strong>
      </div>

      {/* Dark Mode Toggle */}
      <button onClick={toggleDarkMode} className="dark-mode-button">
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      {/* Hacker Mode Toggle */}
      {hackerMode && (
        <button className="hacker-mode-button">
          <FaTerminal /> Hacker Mode Active
        </button>
      )}

      {/* Dashboard Title */}
      <h1 className="glitch">Crime Investigation HQ</h1>

      {/* Admin Buttons */}
      <div className="vertical-button-container">
        {/* Manage Criminals */}
        <div className="dropdown-section">
          <button
            className="glitch-button"
            onClick={() => setShowCriminalOptions(!showCriminalOptions)}
          >
            <FaUserTie /> Manage Criminals
          </button>

          {showCriminalOptions && (
            <div className="dropdown-options fade-in">
              <button
                className="glitch-sub-button"
                onClick={() => navigate("/criminals/add")}
              >
                ➕ Add Criminal
              </button>
              <button
                className="glitch-sub-button"
                onClick={() => navigate("/criminals/update")}
              >
                ✏️ Update Criminal
              </button>
              <button
                className="glitch-sub-button"
                onClick={() => navigate("/criminals/delete")}
              >
                ❌ Delete Criminal
              </button>
            </div>
          )}
        </div>

        <button className="glitch-button alert" onClick={() => navigate("/crimes")}>
          <FaGavel /> View Crimes
        </button>

        <button className="glitch-button" onClick={() => navigate("/police")}>
          <FaUserShield /> Police Officers
        </button>

        <button className="glitch-button" onClick={() => navigate("/cases")}>
          <FaFileAlt /> Court Cases
        </button>

        <button className="glitch-button" onClick={() => navigate("/forensics")}>
          <FaFingerprint /> Forensic Reports
        </button>

        <button className="glitch-button alert" onClick={() => navigate("/prisoners")}>
          <FaLock /> Prisoners
        </button>

        <button className="glitch-button" onClick={() => navigate("/users")}>
          <FaUsers /> Manage Users
        </button>

        <button className="glitch-button" onClick={() => navigate("/evidence")}>
          <FaDatabase /> Crime Scene Evidence
        </button>

        <button className="glitch-button logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
