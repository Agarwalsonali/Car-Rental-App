const db = require('../db/index.js')


//Fucntion to check availability of car for a given date
function checkAvailability(car_id, pickupDate, returnDate, callback) {
    const sql = `
        SELECT * FROM bookings
        WHERE car_id = ?
        AND pickup_date <= ?
        AND return_date >= ?
    `;

    db.query(sql, [car_id, returnDate, pickupDate], function (err, results) {
        if (err) return callback(err);
        
        callback(null, results.length === 0);
    });
}



// API to Check Availability of Cars for the given Date and location
const checkAvailabilityOfCar = (req, res) => {
    const { location, pickupDate, returnDate } = req.body;

   
    const sql = "SELECT * FROM cars WHERE location = ? AND is_available = 1";

    db.query(sql, [location], function (err, cars) {
        if (err) return res.json({ success: false, message: err.message });

        let availableCars = [];
        let processed = 0;

        
        if (cars.length === 0) {
            return res.json({ success: true, availableCars: [] });
        }

   
        cars.forEach(car => {

            checkAvailability(car.car_id, pickupDate, returnDate, function (err, is_available) {
                if (err) return res.json({ success: false, message: err.message });

                if (is_available) {
                    availableCars.push({
                        ...car,
                        is_available: true
                    });
                }

                processed++;

               
                if (processed === cars.length) {
                    res.json({ success: true, availableCars });
                }
            });

        });
    });
};



// API to Create Booking
const createBooking = (req, res) => {
    const userId = req.user.id;  
    const { car, pickupDate, returnDate } = req.body;

    checkAvailability(car, pickupDate, returnDate, function (err, is_available) {

        if (err) {
            console.log(err);
            return res.json({ success: false, message: err.message });
        }

        if (!is_available) {
            return res.json({ success: false, message: "Car is not available" });
        }
        
        try {
              const sqlCar = `SELECT * FROM cars WHERE car_id = ?`;
        db.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
        db.beginTransaction();

        db.query(sqlCar, [car], function (err, carRows) {
            if (err) {
                console.log(err);
                return res.json({ success: false, message: err.message });
            }

            if (carRows.length === 0) {
                return res.json({ success: false, message: "Car not found" });
            }

            const carData = carRows[0];

            const picked = new Date(pickupDate);
            const returned = new Date(returnDate);

            const noOfDays = Math.ceil(
                (returned - picked) / (1000 * 60 * 60 * 24)
            );

            const price = carData.price_per_day * noOfDays;

            const sqlInsert = `
                INSERT INTO bookings
                (car_id, owner_id, user_id, pickup_date, return_date, price)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.query(
                sqlInsert,
                [car, carData.owner_id, userId, pickupDate, returnDate, price], // FIXED
                function (err) {
                    if (err) {
                        console.log(err);
                        return res.json({ success: false, message: err.message });
                    }

                    return res.json({
                        success: true,
                        message: "Booking Created"
                    });
                }
            );

            db.commit();
        });
        } catch (error) {
            db.rollback();
            console.log(error);
            
        }
    });
};


// API to list user bookings
const getUserBookings = (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT 
      b.booking_id,
      b.pickup_date,
      b.return_date,
      b.status,
      b.price,
      b.created_at,
      c.car_id,
      c.image,
      c.category,
      c.price_per_day,
      br.brand_name,
      m.model_name
    FROM bookings b
    JOIN cars c ON b.car_id = c.car_id
    JOIN brand br ON c.brand_id = br.brand_id
    JOIN models m ON c.model_id = m.model_id
    WHERE b.user_id = ?
    ORDER BY b.created_at DESC
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch user bookings",
        error: err.message
      });
    }

    res.status(200).json({
      success: true,
      bookings: results
    });
  });
};



// API to list owner bookings
const getOwnerBookings = (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized"
    });
  }

  const ownerId = req.user.id;

  const sql = `
    SELECT 
      b.booking_id,
      b.pickup_date,
      b.return_date,
      b.status,
      b.price,
      b.created_at,
      u.fname,
      u.lname,
      c.car_id,
      c.image,
      c.category,
      br.brand_name,
      m.model_name
    FROM bookings b
    JOIN cars c ON b.car_id = c.car_id
    JOIN users u ON b.user_id = u.user_id
    JOIN brand br ON c.brand_id = br.brand_id
    JOIN models m ON c.model_id = m.model_id
    WHERE c.owner_id = ?
    ORDER BY b.created_at DESC
  `;

  db.query(sql, [ownerId], (err, results) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch owner bookings",
        error: err.message
      });
    }

    res.status(200).json({
      success: true,
      bookings: results
    });
  });
};




//API to change booking status
const changeBookingStatus = (req, res) => {
    const ownerId = req.user.id;   
    const { bookingId, status } = req.body;


    const sqlFind = `
        SELECT * FROM bookings WHERE booking_id = ?
    `;

    db.query(sqlFind, [bookingId], function (err, rows) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: err.message });
        }

        if (rows.length === 0) {
            return res.json({ success: false, message: "Booking not found" });
        }

        const booking = rows[0];

        if (booking.owner_id != ownerId) {   
            return res.json({
                success: false,
                message: "Unauthorized"
            });
        }

        const sqlUpdate = `
            UPDATE bookings 
            SET status = ?
            WHERE booking_id = ?
        `;

        db.query(sqlUpdate, [status, bookingId], function (err, result) {
            if (err) {
                console.log(err);
                return res.json({ success: false, message: err.message });
            }

            res.json({
                success: true,
                message: "Booking status updated"
            });
        });
    });
};



module.exports = {
  checkAvailabilityOfCar,
  createBooking,
  getUserBookings,
  getOwnerBookings,
  changeBookingStatus
}

