const db = require("../db/index.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER USER
const register = (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName  || !email || !password) {
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
        "INSERT INTO users (fname, lname, email, password) VALUES (?,?,?,?)",
        [firstName, lastName, email, hashedPassword],
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
            firstName,
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
        token,
        userId:user.user_id
      });
    });
  });
};

// GET CURRENT USER
const getUser = (req, res) => {
  try{
    const {user} = req;
    res.json({
      success: true, 
      user
    })
  }catch(error){
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    })
  }
};

// Get All Cars for the Frontend
const getCars = (req, res) => {
    const sql = `
        SELECT * 
        FROM cars 
        WHERE isAvailable = 1
    `;

    db.query(sql, function (err, cars) {
        if (err) {
            console.log(err);
            return res.json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            cars
        });
    });
};


module.exports = { register, login, getUser, getCars};
