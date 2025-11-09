const db = require('../db/index.js');

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
  const { license_plate, Model, Type, status } = req.body;

  if (!license_plate || !Model || !Type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  //Get or create model_id
  getOrCreateId("models", "model_name", Model, (err, modelId) => {
    if (err) {
      console.error("Model lookup failed:", err);
      return res.status(500).json({ error: err.message });
    }

    // Get or create type_id
    getOrCreateId("types", "type_name", Type, (err2, typeId) => {
      if (err2) {
        console.error("Type lookup failed:", err2);
        return res.status(500).json({ error: err2.message });
      }

      // Now both modelId and typeId are defined — do the insert
      db.query(
        "INSERT INTO cars (license_plate, model_id, type_id, status) VALUES (?,?,?,?)",
        [license_plate, modelId, typeId, status || "available"],
        (err3, results3) => {
          if (err3) {
            console.error("Car insert failed:", err3);
            return res.status(500).json({ error: err3.message });
          }

          console.log("Car added successfully:", results3.insertId);
          res.json({
            message: "Car added successfully",
            car_id: results3.insertId,
            model_id: modelId,
            type_id: typeId
          });
        }
      );
    });
  });
};

// Get all cars
const getCars = (req, res) => {
  const query = `
    SELECT c.car_id, c.license_plate, m.model_name, t.type_name, c.status
    FROM cars c
    JOIN models m ON c.model_id = m.model_id
    JOIN types t ON c.type_id = t.type_id
  `;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

const updateCarStatus = (req,res)=>{
  const { id } = req.params;
  const { status } = req.body;
  db.query(
    "UPDATE cars SET status=? WHERE car_id=?",
    [status,id],
    (err)=>{
      if(err){
        return res.status(500).json({
          error:err.message
        })
      }
      return res.json({
        status:status
      })
    }
  )
}

const deleteCar = (req,res)=>{
  const { id } = req.params;
  db.query(
    "DELETE FROM cars WHERE car_id=?",
    [id],(err)=>{
      if(err){
        return res.status(500).json({
          error: err.message
        })
      }
      res.json({
        message: "Car deleted successfully"
      })
    }
  )
}

module.exports = { getCars, addCar, updateCarStatus, deleteCar };
