import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../typing.css"; // Typing effect
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [role, setRole] = useState("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login - Criminal Management System";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Role selected:", role); // Debugging line

    try {
      const response = await axios.post("http://localhost:8000/login", {
        role,
        username,
        password,
      });

      if (response.data.login) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);

        toast.success("Login successful!", { position: "top-center" });

        // Redirect based on role
        if (role === "admin") {
          navigate("/dashboard");
        } else if (role === "police_officer") {
          navigate("/PoliceDashboard");
        }
      } else {
        toast.error(response.data.msg, { position: "top-center" });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Check credentials!", { position: "top-center" });
    }
  };

  return (
    <div style={styles.container}>
      <h1 className="typing" style={styles.welcomeMessage}>Welcome</h1>
      <div style={styles.form}>
        <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.select}>
          <option value="admin">Admin</option>
          <option value="police_officer">Police Officer</option>
        </select>

        <input
          type="text"
          placeholder={role === "admin" ? "Admin Username" : "Police ID"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>Login</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundImage: "url('/bg-image.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  welcomeMessage: {
    fontSize: "4rem",
    fontWeight: "bold",
    color: "black",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: "30px",
    borderRadius: "10px",
    width: "300px",
    gap: "15px",
    alignItems: "center",
  },
  input: {
    padding: "8px",
    width: "100%",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    textAlign: "center",
  },
  select: {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    fontSize: "1rem",
  },
  button: {
    padding: "10px",
    fontSize: "1.1rem",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default LoginPage;
