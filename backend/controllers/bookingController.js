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
        // available → no overlapping booking found
        callback(null, results.length === 0);
    });
}



// API to Check Availability of Cars for the given Date and location
const checkAvailabilityOfCar = (req, res) => {
    const { location, pickupDate, returnDate } = req.body;

    // Step 1: get all cars for that location
    const sql = "SELECT * FROM cars WHERE location = ? AND isAvailable = 1";

    db.query(sql, [location], function (err, cars) {
        if (err) return res.json({ success: false, message: err.message });

        let availableCars = [];
        let processed = 0;

        // If no cars:
        if (cars.length === 0) {
            return res.json({ success: true, availableCars: [] });
        }

        // Step 2: check each car availability
        cars.forEach(car => {

            checkAvailability(car.id, pickupDate, returnDate, function (err, isAvailable) {
                if (err) return res.json({ success: false, message: err.message });

                if (isAvailable) {
                    availableCars.push({
                        ...car,
                        isAvailable: true
                    });
                }

                processed++;

                // When all cars processed, return result
                if (processed === cars.length) {
                    res.json({ success: true, availableCars });
                }
            });

        });
    });
};



// API to Create Booking
const createBooking = (req, res) => {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    // Step 1: use checkAvailability() function
    checkAvailability(car, pickupDate, returnDate, function (err, isAvailable) {

        if (err) {
            console.log(err);
            return res.json({ success: false, message: err.message });
        }

        if (!isAvailable) {
            return res.json({ success: false, message: "Car is not available" });
        }

        // Step 2: fetch car details
        const sqlCar = `SELECT * FROM cars WHERE car_id = ?`;

        db.query(sqlCar, [car], function (err, carRows) {

            if (err) {
                console.log(err);
                return res.json({ success: false, message: err.message });
            }

            if (carRows.length === 0) {
                return res.json({ success: false, message: "Car not found" });
            }

            const carData = carRows[0];

            // Step 3: calculate price
            const picked = new Date(pickupDate);
            const returned = new Date(returnDate);

            const noOfDays = Math.ceil(
                (returned - picked) / (1000 * 60 * 60 * 24)
            );

            const price = carData.price_per_day * noOfDays;

            // Step 4: insert booking
            const sqlInsert = `
                INSERT INTO bookings
                (car_id, owner_id, user_id, pickup_date, return_date, price)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.query(
                sqlInsert,
                [car, carData.owner_id, _id, pickupDate, returnDate, price],
                function (err) {

                    if (err) {
                        console.log(err);
                        return res.json({ success: false, message: err.message });
                    }

                    // Step 5: response
                    res.json({
                        success: true,
                        message: "Booking Created"
                    });
                }
            );
        });
    });
};


//API to list user bookings
const getUserBookings = (req, res) => {
    const { _id } = req.user;

    const sql = `
        SELECT b.*, c.*
        FROM bookings b
        JOIN cars c ON b.car_id = c.car_id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
    `;

    db.query(sql, [_id], function (err, bookings) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: err.message });
        }

        res.json({
            success: true,
            bookings
        });
    });
};



//API to list owner bookings
const getOwnerBookings = (req, res) => {

    // Step 0: Check owner role
    if (req.user.role !== 'owner') {
        return res.json({ success: false, message: "Unauthorized" });
    }

    const ownerId = req.user._id;

    // Step 1: MySQL query to get all bookings of this owner
    // Populate equivalent:
    // JOIN cars → get car details
    // JOIN users → get customer details
    // Do NOT select password
    const sql = `
        SELECT 
            b.*, 
            c.*, 
            u.user_id AS booking_user_id,
            u.firstName AS user_firstname,
            u.lastName AS user_lastname,
            u.email AS user_email
        FROM bookings b
        JOIN cars c ON b.car_id = c.car_id
        JOIN users u ON b.user_id = u.user_id
        WHERE b.owner_id = ?
        ORDER BY b.created_at DESC
    `;

    db.query(sql, [ownerId], function (err, bookings) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: err.message });
        }

        // Step 2: Send response
        res.json({
            success: true,
            bookings
        });
    });
};



//API to change booking status
const changeBookingStatus = (req, res) => {
    const { _id } = req.user; // owner ID
    const { bookingId, status } = req.body;

    // Step 1 → Fetch booking row
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

        // Step 2 → Verify owner authorization
        if (booking.owner_id != _id) {
            return res.json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Step 3 → Update status
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

            // Step 4 → Success
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

