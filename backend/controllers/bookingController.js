const db = require('../db/index.js')

const getBookings = (req,res)=>{
    db.query(
        'SELECT * FROM bookings',(err,results)=>{
            if(err){
                return res.status(500).json({
                    error:err.message
                })
            }
            res.json(results)
        }
    )
}

const addBooking = (req, res) => {
    const { 
        customer_id, 
        car_id, 
        start_date, 
        end_date, 
        booking_status, 
        pickup_location_id, 
        dropoff_location_id, 
        agreement_id 
    } = req.body;

    // Validate customer
    db.query("SELECT * FROM customers WHERE customer_id = ?", [customer_id], (err, customerResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (customerResult.length === 0) return res.status(400).json({ error: "Invalid customer_id" });

        // Validate car
        db.query("SELECT * FROM cars WHERE car_id = ?", [car_id], (err, carResult) => {
            if (err) return res.status(500).json({ error: err.message });
            if (carResult.length === 0) return res.status(400).json({ error: "Invalid car_id" });

            // Validate pickup location
            db.query("SELECT * FROM Locations WHERE location_id = ?", [pickup_location_id], (err, pickupResult) => {
                if (err) return res.status(500).json({ error: err.message });
                if (pickupResult.length === 0) return res.status(400).json({ error: "Invalid pickup_location_id" });

                // Validate dropoff location
                db.query("SELECT * FROM Locations WHERE location_id = ?", [dropoff_location_id], (err, dropoffResult) => {
                    if (err) return res.status(500).json({ error: err.message });
                    if (dropoffResult.length === 0) return res.status(400).json({ error: "Invalid dropoff_location_id" });

                    // Validate agreement
                    db.query("SELECT * FROM Agreements WHERE agreement_id = ?", [agreement_id], (err, agreementResult) => {
                        if (err) return res.status(500).json({ error: err.message });
                        if (agreementResult.length === 0) return res.status(400).json({ error: "Invalid agreement_id" });

                        // If all valid, insert booking
                        db.query(
                            `INSERT INTO bookings 
                            (customer_id, car_id, start_date, end_date, booking_status, pickup_location_id, dropoff_location_id, agreement_id)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                            [
                                customer_id,
                                car_id,
                                start_date,
                                end_date,
                                booking_status || "confirmed",
                                pickup_location_id,
                                dropoff_location_id,
                                agreement_id
                            ],
                            (err, result) => {
                                if (err) return res.status(500).json({ error: err.message });
                                res.json({
                                    message: "Booking created successfully",
                                    booking_id: result.insertId
                                });
                            }
                        );
                    });
                });
            });
        });
    });
};

module.exports = {
    getBookings,
    addBooking
}