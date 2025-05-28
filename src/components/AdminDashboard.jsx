import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserTie, FaGavel, FaUserShield, FaFileAlt,
  FaUsers, FaFingerprint, FaLock, FaSignOutAlt,
  FaDatabase, FaMoon, FaSun, FaTerminal
} from "react-icons/fa";
import Particles from "react-tsparticles";
import "./styles.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("role") || "admin";

  const [darkMode, setDarkMode] = useState(false);
  const [hackerMode, setHackerMode] = useState(false);
  const [showCriminalOptions, setShowCriminalOptions] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    alert("Successfully logged out!");
    navigate("/");
  };

  // Secret Hacker Mode (Ctrl + Shift + X) - Admin only
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (role === "admin" && event.ctrlKey && event.shiftKey && event.code === "KeyX") {
        setHackerMode(!hackerMode);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hackerMode, role]);

  return (
    <div className={darkMode ? "dashboard dark-mode" : "dashboard"}>
      <Particles
        options={{
          particles: {
            number: { value: role === "admin" ? 100 : 30 },
            color: { value: hackerMode ? "#00ff00" : "#ff0000" },
            shape: { type: "circle" },
            opacity: { value: 0.2, anim: { enable: true, speed: 0.5 } },
            size: { value: 2, random: true },
            move: { enable: true, speed: role === "admin" ? 0.7 : 0.3 },
          },
        }}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          zIndex: -1,
        }}
      />

      <div className="logged-in-user">
        <FaUserShield className="user-icon" /> 
        Logged in as: <strong>{username}</strong> ({role.replace('_', ' ')})
      </div>

      {role === "admin" && (
        <button onClick={toggleDarkMode} className="dark-mode-button">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      )}

      {hackerMode && (
        <button className="hacker-mode-button">
          <FaTerminal /> Hacker Mode Active
        </button>
      )}

      <h1 className="glitch">
        {role === "admin" ? "Crime Investigation HQ" : "Police Portal"}
      </h1>

      <div className="vertical-button-container">
        {/* Admin-only Section */}
        {role === "admin" && (
          <>
            <div className="dropdown-section">
              <button
                className="glitch-button"
                onClick={() => setShowCriminalOptions(!showCriminalOptions)}
              >
                <FaUserTie /> Manage Criminals
              </button>
              {showCriminalOptions && (
                <div className="dropdown-options fade-in">
                  <button onClick={() => navigate("/add")}>
                    ➕ Add Criminal
                  </button>
                  <button onClick={() => navigate("/delete")}>
                    Delete Criminal
                  </button>
                </div>
              )}
            </div>

            <button className="glitch-button" onClick={() => navigate("/viewPolice")}>
              <FaUserShield /> Police Officers
            </button>

            <button className="glitch-button" onClick={() => navigate("/cases")}>
              <FaFileAlt /> Court Cases
            </button>

            <button className="glitch-button alert" onClick={() => navigate("/prisoners")}>
              <FaLock /> Prisoners
            </button>

            <button className="glitch-button" onClick={() => navigate("/users")}>
              <FaUsers /> Manage Users
            </button>
          </>
        )}

        {/* Shared Features */}
        <button className="glitch-button alert" onClick={() => navigate("/viewcrimes")}>
          <FaGavel /> View Crimes
        </button>

        <button className="glitch-button" onClick={() => navigate("/evidences")}>
          <FaDatabase /> Crime Scene Evidence
        </button>

        <button className="glitch-button logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
