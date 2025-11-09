const db = require('../db/index.js');

const getPayments = (req,res)=>{
    db.query(
        'SELECT * FROM payments',(err,results)=>{
            if(err) return res.status(500).json({
                error:err.message
            })
            res.json(results)
        }
    )
}

const addPayment = (req, res) => {
  const { Booking_id, Payment_date, Payment_method, Amount } = req.body;

  // Validate that booking exists
  db.query("SELECT * FROM bookings WHERE booking_id = ?", [Booking_id], (err, bookingResult) => {
    if (err) return res.status(500).json({ error: err.message });

    if (bookingResult.length === 0) {
      return res.status(400).json({ error: "Invalid booking_id — no such booking found" });
    }

    // Insert payment if booking is valid
    db.query(
      "INSERT INTO payments (booking_id, payment_date, payment_method, amount) VALUES (?, ?, ?, ?)",
      [Booking_id, Payment_date, Payment_method, Amount],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
          message: "Payment added successfully",
          payment_id: result.insertId
        });
      }
    );
  });
};

module.exports = {
    getPayments,
    addPayment
}
