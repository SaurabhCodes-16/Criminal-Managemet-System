import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
