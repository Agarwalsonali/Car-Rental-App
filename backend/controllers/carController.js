const db = require('../db/index.js');
const ImageKit = require('imagekit');
const fs = require('fs')


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

const addCar = async (req, res) => {
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

    console.log("Received Body:", req.body);

    const owner_id = req.user.id || req.user._id;

    if ([brand, model, year, pricePerDay, category].some(v => !v)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Image upload
    let imageUrl = null;

    if (req.file) {
      const filePath = req.file.path;

      const uploaded = await imagekit.upload({
        file: fs.readFileSync(filePath, { encoding: "base64" }),
        fileName: req.file.originalname,
        folder: "/cars"
      });

      imageUrl = imagekit.url({
        src: uploaded.url,
        transformation: [
          { width: "1280" },
          { quality: "auto" },
          { format: "webp" }
        ]
      });

      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn("Failed to remove temp file:", err.message);
      }
    }

    const img = imageUrl || "default_car.jpg";

    const sql = `
      CALL add_car(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @newCarId);
      SELECT @newCarId AS car_id;
    `;

    const params = [
      owner_id,
      brand,
      model,
      year,
      category,
      seating_capacity,
      fuel_type,
      transmission,
      pricePerDay,
      location,
      description,
      img
    ];

    db.query(sql, params, (err, results) => {
      if (err) {
        console.error("Procedure error:", err);
        return res.status(500).json({ error: err.message });
      }

      // results[1] contains the SELECT result
      const car_id = results[1][0].car_id;

      res.json({
        success: true,
        message: "Car added successfully",
        car_id
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



// Get all cars
const getCars = (req, res) => {

  db.query("CALL get_available_cars();", (err, results) => {
    if (err) {
  console.error("DB ERROR:", err);
  return res.status(500).json({
    success: false,
    message: "Database query failed",
    error: err.message
  });
}


    const cars = results[0];

    return res.json({
      success: true,
      cars
    });
  });

};




// Get car by ID
const getCarById = (req, res) => {
  const { id } = req.params;

  db.query("CALL get_car_by_id(?);", [id], (err, results) => {
    if (err) {
      console.error("Error fetching car by ID:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const car = results[0][0]; 

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(car);
  });
};



// Update car availability (status toggle)
const toggleCarAvailability = (req, res) => {
  try {
    const owner_id = req.user.id;
    const { carId } = req.body;

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

      
      if (String(car.owner_id) !== String(owner_id)) {
        return res.json({ success: false, message: "Unauthorized" });
      }

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

    if (!carId) {
      return res.json({ success: false, message: "carId is required" });
    }

   
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

      if (String(car.owner_id) !== String(owner_id)) {
        return res.json({ success: false, message: "Unauthorized: Not your car" });
      }

     
      const updateQuery = `
        UPDATE cars 
        SET owner_id = NULL 
        WHERE car_id = ?
      `;

      db.query(updateQuery, [carId], (err2) => {
        if (err2) {
          console.log(err2);
          return res.json({ success: false, message: err2.message });
        }

        res.json({
          success: true,
          message: "Car removed from your ownership"
        });
      });
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};




module.exports = { getCars, addCar, toggleCarAvailability, deleteCar,getCarById, removeCarOwner};
