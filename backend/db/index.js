const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectTimeout: 20000
});

/* ================= CONNECT ================= */

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    return;
  }
  console.log("✅ Connected to MYSQL Database");

});

// /* ================= USERS TABLE ================= */

// function createUsersTable() {
//   const usersTableQuery = `
//     CREATE TABLE IF NOT EXISTS users (
//       user_id INT AUTO_INCREMENT PRIMARY KEY,
//       fname VARCHAR(100),
//       mname VARCHAR(100),
//       lname VARCHAR(100),
//       email VARCHAR(100) UNIQUE,
//       password VARCHAR(255),
//       role ENUM('owner','user') DEFAULT 'user',
//       image VARCHAR(255),
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       updated_at DATETIME DEFAULT NULL,
//       street VARCHAR(150),
//       city VARCHAR(150),
//       state VARCHAR(150)
//     ) ENGINE=InnoDB;
//   `;

//   db.query(usersTableQuery, (err) => {
//     if (err) {
//       console.error("❌ Error creating users table:", err.message);
//       return;
//     }
//     console.log("✅ users table created");
//     createBookingsTable();
//   });
// }

// /* ================= BOOKINGS TABLE ================= */

// function createBookingsTable() {
//   const bookingsTableQuery = `
//     CREATE TABLE IF NOT EXISTS bookings (
//       booking_id INT AUTO_INCREMENT PRIMARY KEY,
//       car_id INT,
//       user_id INT,
//       owner_id INT,
//       pickup_date DATE,
//       return_date DATE,
//       status ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
//       price DECIMAL(10,2),
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       updated_at DATETIME DEFAULT NULL,
//       FOREIGN KEY (car_id) REFERENCES cars(car_id),
//       FOREIGN KEY (user_id) REFERENCES users(user_id)
//     ) ENGINE=InnoDB;
//   `;

//   db.query(bookingsTableQuery, (err) => {
//     if (err) {
//       console.error("❌ Error creating bookings table:", err.message);
//       return;
//     }
//     console.log("✅ bookings table created");
//     showTables();
//   });
// }

/* ================= SHOW TABLES ================= */

// function showTables() {
//   db.query("SHOW TABLES", (err, results) => {
//     if (err) {
//       console.error("❌ Error fetching tables:", err.message);
//     } else {
//       console.log("📦 Tables in DB:");
//       console.table(results);
//     }
//   });
// }

module.exports = db;
