const db = require('../db/index.js');
const fs = require('fs')
const ImageKit = require("imagekit");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

dotenv.config();

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});


const changeRoleToOwner = (req, res) => {
    const user_id = req.user.id;

    const updateSql = "UPDATE users SET role = 'owner' WHERE user_id = ?";

    db.query(updateSql, [user_id], (err) => {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: err.message });
        }


        const newToken = jwt.sign(
            { id: user_id, email: req.user.email, role: "owner" },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            success: true,
            message: "Role updated to owner",
            token: newToken
        });
    });
};


const getOwnerCars = (req, res) => {
  try {
    const owner_id = req.user.id;  

    const query = `
      SELECT 
        cars.car_id,
        cars.image,
        cars.year,
        cars.category,
        cars.seating_capacity,
        cars.fuel_type,
        cars.transmission,
        cars.price_per_day,
        cars.location,
        cars.description,
        cars.is_available,
        cars.created_at,

        brand.brand_name,
        models.model_name

      FROM cars
      LEFT JOIN brand 
        ON cars.brand_id = brand.brand_id
      LEFT JOIN models 
        ON cars.model_id = models.model_id
      WHERE cars.owner_id = ?
      ORDER BY cars.car_id DESC
    `;

    db.query(query, [owner_id], (err, results) => {
      if (err) {
        console.log("SQL Error:", err.message);
        return res.json({ success: false, message: err.message });
      }

      return res.json({
        success: true,
        cars: results
      });
    });

  } catch (error) {
    console.log("Controller Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};


const getDashboardData = (req, res) => {
    const { id, role } = req.user; 

    if (role !== 'owner') {
        return res.json({ success: false, message: "Unauthorized" });
    }

  
    const sqlCars = `
        SELECT * FROM cars WHERE owner_id = ?
    `;

    db.query(sqlCars, [id], function (err, cars) {
        if (err) {
            console.log(err);
            return res.json({ success: false, message: err.message });
        }

      
        const sqlBookings = `
            SELECT b.*, c.*
            FROM bookings b
            JOIN cars c ON b.car_id = c.car_id
            WHERE b.owner_id = ?
            ORDER BY b.created_at DESC
        `;

        db.query(sqlBookings, [id], function (err, bookings) {
            if (err) {
                console.log(err);
                return res.json({ success: false, message: err.message });
            }

            const pendingBookings = bookings.filter(b => b.status === "pending");
            const completedBookings = bookings.filter(b => b.status === "confirmed");
            const monthlyRevenue = completedBookings.reduce((sum, b) => sum + b.price, 0);

            const recentBookings = bookings.slice(0, 3).map(b => ({
                ...b,
                car: { 
                    brand: b.brand_name || b.brand,
                    model: b.model_name || b.model
                }
            }));

            return res.json({
                success: true,
                dashboardData: {
                    totalCars: cars.length,
                    totalBookings: bookings.length,
                    pendingBookings: pendingBookings.length,
                    completedBookings: completedBookings.length,
                    recentBookings,
                    monthlyRevenue
                }
            });
        });
    });
};



//API to update user image

const updateUserImage = async (req, res) => {
    try {
        const user_id = req.user.id;

        if (!req.file) {
            return res.json({ success: false, message: "No image uploaded" });
        }

        const filePath = req.file.path;

        const uploaded = await imagekit.upload({
            file: fs.readFileSync(filePath, { encoding: 'base64' }),
            fileName: req.file.originalname,
            folder: "/users"
        });

        // use uploaded to build optimizedUrl
            

                const optimizedUrl = imagekit.url({
                    src: uploaded.url,
                    transformation: [{ width: "400" }, { quality: "auto" }, { format: "webp" }]
                });

                const sql = "UPDATE users SET image = ? WHERE user_id = ?";

                db.query(sql, [optimizedUrl, user_id], (err) => {
                    if (err) {
                        console.log(err);
                        return res.json({ success: false, message: err.message });
                    }

                    return res.json({
                        success: true,
                        message: "Image updated successfully",
                        image: optimizedUrl
                    });
                });
            }catch (error) {
              console.log(error);
              res.json({ success: false, message: error.message });
    }
};

module.exports = {
    changeRoleToOwner,
    getOwnerCars,
    getDashboardData,
    updateUserImage
}
