const db = require('../db/index.js');
const ImageKit = require('@imagekit/nodejs');
const fs = require('fs')

// Your ImageKit config
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});


// Helper to get or create model_id and type_id
function getOrCreateId(table, nameField, value, callback) {
  db.query(`SELECT * FROM ${table} WHERE ${nameField} = ?`, [value], (err, results) => {
    if (err) return callback(err);
    if (results.length > 0) {
      const idField = `${table.slice(0, -1).toLowerCase()}_id`; // models → model_id
      return callback(null, results[0][idField]);
    }
    db.query(`INSERT INTO ${table} (${nameField}) VALUES (?)`, [value], (err2, result2) => {
      if (err2) return callback(err2);
      callback(null, result2.insertId);
    });
  });
}

// addCar
const addCar = (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      pricePerDay,
      category,
      transmission,
      fuel_type,
      seating_capacity,
      location,
      description
    } = req.body;

    const owner_id = req.user.id;

    if (!brand || !model || !year || !pricePerDay || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // -------------------------------------
    //  HANDLE IMAGE UPLOAD WITH IMAGEKIT
    // -------------------------------------

    let imageUrl = null;

    if (req.file) {
      const filePath = req.file.path;

      const uploaded = imagekit.upload({
        file: fs.readFileSync(filePath),
        fileName: req.file.originalname,
        folder: "/cars"
      });

      // After upload, generate optimized URL
      imageUrl = imagekit.url({
        src: uploaded.url,
        transformation: [
          {
            width: "1280",
            quality: "auto",
            format: "webp"
          }
        ]
      });

      // Remove file from server after uploading to ImageKit
      fs.unlinkSync(filePath);
    }

    // -------------------------------------
    //  GET OR CREATE BRAND ID
    // -------------------------------------
    getOrCreateId("brand", "brand_name", brand, (err, brandId) => {
      if (err) return res.status(500).json({ error: err.message });

      // -------------------------------------
      //  GET OR CREATE MODEL ID
      // -------------------------------------
      getOrCreateId("models", "model_name", model, (err2, modelId) => {
        if (err2) return res.status(500).json({ error: err2.message });

        // -------------------------------------
        //  INSERT CAR INTO DATABASE
        // -------------------------------------
        const sql = `
          INSERT INTO cars (
            owner_id, brand_id, model_id, year, category, seating_capacity,
            fuel_type, transmission, price_per_day, location, description,
            image, is_available
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
          owner_id,
          brandId,
          modelId,
          year,
          category,
          seating_capacity,
          fuel_type,
          transmission,
          pricePerDay,
          location,
          description,
          imageUrl || "default_car.jpg",
          1
        ];

        db.query(sql, values, (err3, result) => {
          if (err3) {
            console.error("Car insert failed:", err3);
            return res.status(500).json({ error: err3.message });
          }

          res.json({
            success: true,
            message: "Car added successfully",
            car_id: result.insertId
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// Get all cars
const getCars = (req, res) => {
  const query = `
    SELECT 
      c.car_id,
      b.brand_name,
      m.model_name,
      c.image,
      c.year,
      c.category,
      c.seating_capacity,
      c.fuel_type,
      c.transmission,
      c.price_per_day,
      c.location,
      c.description,
      c.is_available,
      c.created_at
    FROM cars c
    JOIN brand b ON c.brand_id = b.brand_id
    JOIN models m ON c.model_id = m.model_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching cars:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
};

// Get car by ID
 const getCarById = (req, res) => {

  const { id } = req.params;

  const query = `
    SELECT 
      c.car_id, 
      c.owner_id, 
      b.brand_name AS brand, 
      m.model_name AS model, 
      c.image, 
      c.year, 
      c.category, 
      c.seating_capacity, 
      c.fuel_type, 
      c.transmission, 
      c.price_per_day AS pricePerDay, 
      c.location, 
      c.description, 
      c.is_available AS isAvailable, 
      c.created_at AS createdAt
    FROM cars c
    JOIN brand b ON c.brand_id = b.brand_id
    JOIN models m ON c.model_id = m.model_id
    WHERE c.car_id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching car by ID:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(results[0]);
  });
};


// Update car availability (status toggle)
const toggleCarAvailability = (req, res) => {
  try {
    const owner_id = req.user.id;
    const { carId } = req.body;

    // Step 1: Fetch car from DB
    const selectQuery = "SELECT * FROM cars WHERE car_id = ?";
    db.query(selectQuery, [carId], (err, results) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, message: err.message });
      }

      if (results.length === 0) {
        return res.json({ success: false, message: "Car not found" });
      }

      const car = results[0];

      // Step 2: Check if this car belongs to the user
      if (car.owner_id !== owner_id) {
        return res.json({ success: false, message: "Unauthorized" });
      }

      // Step 3: Toggle availability
      const newAvailability = car.is_available ? 0 : 1;

      const updateQuery = `
        UPDATE cars 
        SET is_available = ?
        WHERE car_id = ?
      `;

      db.query(updateQuery, [newAvailability, carId], (err2) => {
        if (err2) {
          console.log(err2);
          return res.json({ success: false, message: err2.message });
        }

        // Step 4: Return updated car
        const updatedCar = { ...car, is_available: newAvailability };

        res.json({
          success: true,
          car: updatedCar
        });
      });
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// Delete car
const deleteCar = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM cars WHERE car_id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting car:", err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json({ message: "Car deleted successfully" });
  });
};

const removeCarOwner = (req, res) => {
  try {
    const owner_id = req.user.id;
    const { carId } = req.body;

    // Step 1: Get car details
    const selectQuery = "SELECT * FROM cars WHERE car_id = ?";

    db.query(selectQuery, [carId], (err, results) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, message: err.message });
      }

      if (results.length === 0) {
        return res.json({ success: false, message: "Car not found" });
      }

      const car = results[0];

      // Step 2: Check if user is the owner
      if (car.owner_id !== owner_id) {
        return res.json({ success: false, message: "Unauthorized: Not your car" });
      }

      // Step 3: Remove owner (set owner_id = NULL)
      const updateQuery = "UPDATE cars SET owner_id = NULL WHERE car_id = ?";

      db.query(updateQuery, [carId], (err2) => {
        if (err2) {
          console.log(err2);
          return res.json({ success: false, message: err2.message });
        }

        res.json({
          success: true,
          message: "Owner removed from car successfully"
        });
      });
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};




module.exports = { getCars, addCar, toggleCarAvailability, deleteCar,getCarById, removeCarOwner};
