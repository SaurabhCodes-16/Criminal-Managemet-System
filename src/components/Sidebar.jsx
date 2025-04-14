import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={{ width: "250px", height: "100vh", background: "#333", color: "#fff", padding: "20px" }}>
      <h2>Admin Panel</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link></li>
        <li><Link to="/criminals" style={{ color: "white", textDecoration: "none" }}>Criminals</Link></li>
        <li><Link to="/crimes" style={{ color: "white", textDecoration: "none" }}>Crimes</Link></li>
        <li><Link to="/officers" style={{ color: "white", textDecoration: "none" }}>Police Officers</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
