const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

const multer = require("multer");
const path = require("path");

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

app.use("/uploads", express.static("uploads"));


const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });


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

app.put("/evidences/:id", upload.single("image"), (req, res) => {
    const { id } = req.params;
    const {
      witness_first_name,
      witness_last_name,
      victim_first_name,
      victim_last_name,
      forensic_report,
      case_id
    } = req.body;
    const imagePath = req.file ? req.file.filename : req.body.image;

    const query = `
      UPDATE evidence 
      SET 
        witness_first_name = ?, 
        witness_last_name = ?, 
        victim_first_name = ?, 
        victim_last_name = ?, 
        image = ?, 
        forensic_report = ?, 
        case_id = ?
      WHERE id = ?
    `;

    db.query(query, [
      witness_first_name,
      witness_last_name,
      victim_first_name,
      victim_last_name,
      imagePath,
      forensic_report,
      case_id,
      id
    ], (err, result) => {
      if (err) {
        console.error("Failed to update evidence:", err);
        return res.status(500).json({ message: "Database update error." });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Evidence not found." });
      }

      res.json({ message: "Evidence updated successfully." });
    });
});

  

app.post("/login", (req, res) => {
    const { role, username, password } = req.body;

    if (!role || !username || !password) {
        return res.status(400).json({ login: false, msg: "Missing fields" });
    }

    // Use parameterized query for security
    const query = "SELECT * FROM users WHERE username = ? AND role = ?";
    db.query(query, [username, role], (err, results) => {
        if (err) {
            console.error("DB error:", err);
            return res.status(500).json({ login: false, msg: "Server error" });
        }

        if (results.length === 0) {
            return res.json({ login: false, msg: "Invalid credentials" });
        }

        const user = results[0];
        
        // Add proper password hashing in production
        if (user.password === password) {
            console.log(`✅ ${role} login: ${username}`);
            return res.json({ 
                login: true, 
                user: {
                    username: user.username,
                    role: user.role
                } 
            });
        } else {
            console.log(`❌ Failed login attempt: ${username}`);
            return res.json({ login: false, msg: "Invalid credentials" });
        }
    });
});

// Add User Route
app.post("/addUser", (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ success: false, msg: "Missing fields" });
    }

    const query = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
    db.query(query, [username, password, role], (err, result) => {
        if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).json({ success: false, msg: "Error adding user" });
        }
        res.json({ success: true, msg: "User added successfully", userId: result.insertId });
    });
});

// Delete User Route
app.delete("/deleteUser/:username", (req, res) => {
    const { username } = req.params;
    const query = "DELETE FROM users WHERE username = ?";
    db.query(query, [username], (err, result) => {
      if (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ success: false, msg: "Error deleting user" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, msg: "User not found" });
      }
      res.json({ success: true, msg: "User deleted successfully" });
    });
  });
  


// Criminal Routes
app.post("/add", (req, res) => {
    const { FirstName, LastName, age, crime, dob, Address, crimeDate } = req.body;
    if (!FirstName || !LastName || !age || !crime || !dob || !Address || !crimeDate) {
        return res.status(400).json({ success: false, msg: "Missing fields" });
    }

    const query = "INSERT INTO criminals (FirstName, LastName, age, crime, dob, Address, dateofcrime) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(query, [FirstName, LastName, age, crime, dob, Address, crimeDate], (err, result) => {
        if (err) {
            console.error("DB error:", err);
            return res.status(500).json({ success: false, msg: "Error inserting criminal" });
        }
        res.json({ success: true, msg: "Criminal added successfully", criminalId: result.insertId });
    });
});

app.delete("/delete/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM criminals WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, msg: "Error deleting criminal" });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, msg: "Criminal not found" });
        res.json({ success: true, msg: "Criminal deleted successfully" });
    });
});

app.get("/criminals", (req, res) => {
    const query = "SELECT * FROM criminals";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ success: false, msg: "Error fetching criminals" });
        res.json(results);
    });
});

app.get("/viewusers", (req, res) => {
    const query = "SELECT * FROM users";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

// Police Officer Routes
app.get("/viewPolice", (req, res) => {
    const query = "SELECT * FROM police_officers";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

app.post("/addOfficer", (req, res) => {
    const { name, badge_number, officer_rank, contact_number } = req.body;
    if (!name || !badge_number || !officer_rank || !contact_number) {
        return res.status(400).json({ success: false, msg: "Missing fields" });
    }

    const query = "INSERT INTO police_officers (name, badge_number, officer_rank, contact_number) VALUES (?, ?, ?, ?)";
    db.query(query, [name, badge_number, officer_rank, contact_number], (err, result) => {
        if (err) return res.status(500).json({ success: false, msg: "Error adding officer" });
        res.json({ id: result.insertId, name, badge_number, officer_rank, contact_number });
    });
});

app.delete("/deleteOfficer/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM police_officers WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, msg: "Error deleting officer" });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, msg: "Officer not found" });
        res.json({ success: true, msg: "Officer deleted successfully" });
    });
});

// Court Case Routes
app.post("/addCourtCase", (req, res) => {
    const { criminal_id, police_officer_id, case_status, evidence, prisoner_status } = req.body;
    if (!criminal_id) {
        return res.status(400).json({ success: false, msg: "Criminal ID is required" });
    }

    const query = `
        INSERT INTO court_cases (criminal_id, police_officer_id, case_status, evidence, prisoner_status)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [
        criminal_id,
        police_officer_id || null,
        case_status || 'active',
        evidence || '',
        prisoner_status || 'prisoner'
    ], (err, result) => {
        if (err) return res.status(500).json({ success: false, msg: "Error adding court case" });
        res.json({ success: true, msg: "Court case added", case_id: result.insertId });
    });
});



app.get("/viewCourtCases", (req, res) => {
    const query = `
      SELECT 
        cc.*, 
        c.FirstName AS criminal_firstname, 
        c.LastName AS criminal_lastname, 
        po.name AS officer_name,
        j.name AS judge_name,
        l.name AS lawyer_name
      FROM court_cases cc
      LEFT JOIN criminals c ON cc.criminal_id = c.id
      LEFT JOIN police_officers po ON cc.police_officer_id = po.id
      LEFT JOIN judges j ON cc.judge_id = j.id
      LEFT JOIN lawyers l ON cc.lawyer_id = l.id
    `;
    
    
    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ success: false, msg: "Error retrieving court cases" });
      res.json(results);
    });
  });
  

app.put("/updateCourtCase/:case_id", (req, res) => {
    const { case_id } = req.params;
    const { case_status, prisoner_status } = req.body;

    const query = `
        UPDATE court_cases
        SET case_status = ?, prisoner_status = ?
        WHERE case_id = ?
    `;

    db.query(query, [case_status, prisoner_status, case_id], (err, result) => {
        if (err) {
            console.error("Failed to update court case:", err);
            return res.status(500).json({ success: false, msg: "Database error while updating court case" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, msg: "Court case not found" });
        }

        res.json({ success: true, msg: "Court case updated successfully" });
    });
});
// Get all judges
app.get("/judges", async (req, res) => {
    const [rows] = await db.query("SELECT * FROM judges");
    res.json(rows);
  });
  
  // Get all lawyers
  app.get("/lawyers", async (req, res) => {
    const [rows] = await db.query("SELECT * FROM lawyers");
    res.json(rows);
  });
  


// Evidence Routes (Updated with API prefix)
app.post("/evidences", (req, res) => {
    const {
      witness_first_name,
      witness_last_name,
      victim_first_name,
      victim_last_name,
      image,
      forensic_report,
      case_id,
      submitted_by
    } = req.body;
  
    const sql = `
      INSERT INTO evidence
      (witness_first_name, witness_last_name, victim_first_name, victim_last_name, image, forensic_report, case_id, submitted_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    db.query(sql, [witness_first_name, witness_last_name, victim_first_name, victim_last_name, image, forensic_report, case_id, submitted_by], (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to insert evidence", details: err });
      res.status(201).json({ message: "Evidence inserted successfully!" });
    });
  });
  

app.get("/evidences", (req, res) => {
    const query = "SELECT * FROM evidence";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching evidences:", err);
            return res.status(500).json({ success: false, msg: "Database error" });
        }
        res.json(results);
    });
});


// New endpoint for case IDs dropdown
app.get("/api/court-cases", (req, res) => {
    const query = "SELECT case_id FROM court_cases";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Case ID fetch error:", err);
            return res.status(500).json({ success: false, msg: "Failed to fetch case IDs" });
        }
        res.json(results);
    });
});
app.delete("/handleDelete/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM evidence WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, msg: "Error deleting evidence" });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, msg: "Officer not found" });
        res.json({ success: true, msg: "evidence deleted successfully" });
    });
});

// Express route (add this in your server.js or evidenceRoutes.js file)
app.put("/evidences/:id", (req, res) => {
    const id = req.params.id;
    const {
      witness_first_name,
      witness_last_name,
      victim_first_name,
      victim_last_name,
      image,
      forensic_report,
      case_id,
      submitted_by
    } = req.body;
  
    const sql = `
      UPDATE evidence
      SET witness_first_name=?, witness_last_name=?, victim_first_name=?, victim_last_name=?, image=?, forensic_report=?, case_id=?, submitted_by=?
      WHERE id=?
    `;
  
    db.query(sql, [witness_first_name, witness_last_name, victim_first_name, victim_last_name, image, forensic_report, case_id, submitted_by, id], (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to update evidence", details: err });
      res.status(200).json({ message: "Evidence updated successfully!" });
    });
  });
  
  
  
  

// Prisoner Routes
app.get("/prisoners", (req, res) => {
    const query = `
        SELECT cc.case_id, c.id AS criminal_id, c.FirstName, c.LastName, c.age, c.crime, c.dob, c.Address, cc.prisoner_status
        FROM court_cases cc
        JOIN criminals c ON cc.criminal_id = c.id
        WHERE cc.prisoner_status = 'prisoner'
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching prisoners:", err);
            return res.status(500).json({ success: false, msg: "Failed to fetch prisoners" });
        }
        res.json(results);
    });
});


app.listen(PORT,'0.0.0.0', () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
