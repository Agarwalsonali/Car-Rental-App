const db = require('../db/index.js');
const fs = require('fs')
const ImageKit = require('@imagekit/nodejs');

const changeRoleToOwner = async (req, res) => {
  try {
    const user_id = req.user; // you stored logged-in user's id in req.user

    const sql = `UPDATE users SET role = 'owner' WHERE user_id = ?`;

    db.query(sql, [user_id], (err, result) => {
      if (err) {
        console.log(err.message);
        return res.json({ success: false, message: err.message });
      }

      // result.affectedRows tells if update happened
      if (result.affectedRows === 0) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }

      return res.json({
        success: true,
        message: "Now you can list cars",
      });
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

const getOwnerCars = (req, res) => {
  try {
    const owner_id = req.user.id;

    const query = `
      SELECT 
        cars.*, 
        brand.brand_name,
        models.model_name
      FROM cars
      LEFT JOIN brand ON cars.brand_id = brand.id
      LEFT JOIN models ON cars.model_id = models.id
      WHERE cars.owner_id = ?
    `;

    db.query(query, [owner_id], (err, results) => {
      if (err) {
        console.log(err.message);
        return res.json({ success: false, message: err.message });
      }

      res.json({
        success: true,
        cars: results
      });
    });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}


const getDashboardData = (req, res) => {
    const { _id, role } = req.user;

    // Step 0 — Authorization
    if (role !== 'owner') {
        return res.json({ success: false, message: "Unauthorized" });
    }

    // Step 1 — Fetch cars owned by this owner
    const sqlCars = `
        SELECT * FROM cars WHERE owner_id = ?
    `;

    db.query(sqlCars, [_id], function (err, cars) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: err.message });
        }

        // Step 2 — Fetch bookings (JOIN to get car info)
        const sqlBookings = `
            SELECT b.*, c.*
            FROM bookings b
            JOIN cars c ON b.car_id = c.car_id
            WHERE b.owner_id = ?
            ORDER BY b.created_at DESC
        `;

        db.query(sqlBookings, [_id], function (err, bookings) {
            if (err) {
                console.log(err);
                return res.json({ success: false, message: err.message });
            }

            // Step 3 — Pending and Completed
            const pendingBookings = bookings.filter(
                b => b.status === "pending"
            );

            const completedBookings = bookings.filter(
                b => b.status === "confirmed"
            );

            // Step 4 — Monthly Revenue
            const monthlyRevenue = completedBookings.reduce(
                (acc, b) => acc + b.price,
                0
            );

            // Step 5 — Recent Bookings (Top 3)
            const recentBookings = bookings.slice(0, 3);

            // Step 6 — Dashboard Object
            const dashboardData = {
                totalCars: cars.length,
                totalBookings: bookings.length,
                pendingBookings: pendingBookings.length,
                completedBookings: completedBookings.length,
                recentBookings,
                monthlyRevenue
            };

            res.json({ success: true, dashboardData });
        });
    });
};


//API to update user image
const updateUserImage = (req, res) => {
    const { _id } = req.user;
    const imageFile = req.file;

    // Read file buffer
    const fileBuffer = fs.readFileSync(imageFile.path);

    // Upload to ImageKit (callback version)
    ImageKit.upload(
        {
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/users",
        },
        function (err, response) {
            if (err) {
                console.log(err);
                return res.json({ success: false, message: err.message });
            }

            // Optimize transformed URL
            const optimizedImageUrl = imagekit.url({
                path: response.filePath,
                transformation: [
                    { width: "400" },     // resize
                    { quality: "auto" },  // auto compress
                    { format: "webp" },   // convert to webp
                ],
            });

            // Update user image in MySQL
            const sql = `
                UPDATE users 
                SET image = ? 
                WHERE user_id = ?
            `;

            db.query(sql, [optimizedImageUrl, _id], function (err) {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, message: err.message });
                }

                // Success response
                res.json({
                    success: true,
                    message: "Image Updated",
                    image: optimizedImageUrl,
                });
            });
        }
    );
};


module.exports = {
    changeRoleToOwner,
    getOwnerCars,
    getDashboardData,
    updateUserImage
}
