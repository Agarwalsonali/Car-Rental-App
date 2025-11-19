const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./db/index.js');
const carRoutes = require('./routes/carRoutes.js')
const bookingRoutes = require("./routes/bookingRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes");
const locationRoutes = require("./routes/locationRoutes");
const agreementRoutes = require("./routes/agreementRoutes");
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require("./routes/userRoutes.js");
const ownerRoutes = require('./routes/ownerRoutes.js');
const path = require("path");

dotenv.config();

const app = express();

// app.use(cors({
//     origin:"http://localhost:5173",
//     credentials:true
// }))

app.use(cors({
    origin:"*",
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use("/api/user", userRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/cars',carRoutes);
app.use('/api/bookings',bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/agreements", agreementRoutes);

app.get('/',(req,res)=>{
    res.json({
        message: "Car Rental Management API Running"
    })
})

app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({ error: err.message });
});

app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`);
})