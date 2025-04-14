const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "Saurabh",
    password: "Saurabh_16",
    database: "criminal_db"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

// 🔐 Login Route (No encryption)
app.post("/login", (req, res) => {
    const { role, username, password } = req.body;

    if (!role || !username || !password) {
        return res.status(400).json({ login: false, msg: "Missing fields" });
    }

    const query = "SELECT * FROM users WHERE username = ? AND role = ?";
    db.query(query, [username, role], (err, results) => {
        if (err) {
            console.error("DB error:", err);
            return res.status(500).json({ login: false, msg: "Server error" });
        }

        if (results.length === 0) {
            return res.json({ login: false, msg: "Invalid username or role" });
        }

        const user = results[0];
        if (user.password === password) {
            console.log(`✅ ${role.toUpperCase()} logged in: ${username}`);
            res.json({ login: true, user, msg: "Login successful" });
        } else {
            console.log(`❌ Wrong password for ${username}`);
            res.json({ login: false, msg: "Incorrect password" });
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
