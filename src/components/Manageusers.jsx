import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaUserMinus, FaUserShield } from "react-icons/fa";
import "../components/css/users.css";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [usernameToDelete, setUsernameToDelete] = useState("");


  // Handle form submission for adding a user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/adduser", {
        username,
        password,
        role,
      });
      alert("User added successfully!");
      
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Error adding user!");
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`http://localhost:8000/deleteuser/${usernameToDelete}`);
      alert("User deleted successfully!");
      setUsernameToDelete(""); // Clear input
      // Optional: Refresh user list or redirect
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user!");
    }
  };
  
  return (
    <div className="manage-users-container">
      <h2>Manage Users</h2>

      {/* Add User Form */}
      <form onSubmit={handleAddUser}>
        <h3>Add User</h3>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="Admin">Admin</option>
          <option value="Officer">Officer</option>
        </select>
        <button type="submit">
          <FaUserPlus /> Add User
        </button>
      </form>

      {/* Delete User Form */}
      <form onSubmit={handleDeleteUser}> 
  <h3>Delete User</h3>

  <input
    type="text"
    placeholder="Username to delete"
    value={usernameToDelete}  // ✅ Binds state
    onChange={(e) => setUsernameToDelete(e.target.value)}  // ✅ Updates state
    required  // ✅ Ensures non-empty input
  />

  <button type="submit">
    <FaUserMinus /> Delete User  
  </button>
</form>
/</div>
  );
};

export default ManageUsers;
