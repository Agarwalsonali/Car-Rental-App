const db = require("../db/index.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER USER
const register = (req, res) => {
  const { fname, mname, lname, email, password } = req.body;

  if (!fname || !email || !password) {
    return res.status(400).json({ message: "First name, email, and password are required" });
  }

  // Check if user already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    bcrypt.hash(password, 10, (err2, hashedPassword) => {
      if (err2) return res.status(500).json({ message: err2.message });

      // Insert user
      db.query(
        "INSERT INTO users (fname, mname, lname, email, password) VALUES (?,?,?,?,?)",
        [fname, mname || null, lname || null, email, hashedPassword],
        (err3, result) => {
          if (err3) return res.status(500).json({ message: err3.message });

          // Generate token
          const token = jwt.sign(
            { id: result.insertId, email },
            process.env.JWT_SECRET || "your_jwt_secret",
            { expiresIn: "2h" }
          );

          res.status(201).json({
            message: "User registered successfully",
            userId: result.insertId,
            fname,
            email,
            token,
          });
        }
      );
    });
  });
};

// LOGIN USER
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err2, isMatch) => {
      if (err2) return res.status(500).json({ message: err2.message });
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.user_id, email },
        process.env.JWT_SECRET || "your_jwt_secret",
        { expiresIn: "2h" }
      );

      res.json({
        message: "Login successful",
        user: {
          fname: user.fname,
          lname: user.lname,
          email: user.email,
        },
        token,
      });
    });
  });
};

// GET CURRENT USER
const getMe = (req, res) => {
  db.query(
    "SELECT user_id, fname, lname, email FROM users WHERE user_id = ?",
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(results[0]);
    }
  );
};

module.exports = { register, login, getMe };
