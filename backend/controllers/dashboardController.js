const db = require("../db/index.js");

// DASHBOARD SUMMARY
const getDashboardSummary = (req, res) => {
  try {
    const summary = {};

    // Count cars
    db.query("SELECT COUNT(*) AS total_cars FROM cars", (err1, result1) => {
      if (err1) {
        console.error("Dashboard summary failed (cars):", err1);
        return res.status(500).json({ message: err1.message });
      }

      summary.totalCars = result1[0].total_cars;

      // Count customers
      db.query("SELECT COUNT(*) AS total_customers FROM customers", (err2, result2) => {
        if (err2) {
          console.error("Dashboard summary failed (customers):", err2);
          return res.status(500).json({ message: err2.message });
        }

        summary.totalCustomers = result2[0].total_customers;

        // Count bookings
        db.query("SELECT COUNT(*) AS total_bookings FROM bookings", (err3, result3) => {
          if (err3) {
            console.error("Dashboard summary failed (bookings):", err3);
            return res.status(500).json({ message: err3.message });
          }

          summary.totalBookings = result3[0].total_bookings;

          // Count available cars
          db.query("SELECT COUNT(*) AS available_cars FROM cars WHERE status = 'available'", (err4, result4) => {
            if (err4) {
              console.error("Dashboard summary failed (available cars):", err4);
              return res.status(500).json({ message: err4.message });
            }

            summary.availableCars = result4[0].available_cars;

            // Final response
            res.json({
              message: "Dashboard summary fetched successfully",
              summary,
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("Dashboard summary failed:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardSummary };
