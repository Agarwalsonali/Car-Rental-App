const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./db/index.js');
const carRoutes = require('./routes/carRoutes.js')
const userRoutes = require("./routes/userRoutes.js");
const bookingRoutes = require("./routes/bookingRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes");
const locationRoutes = require("./routes/locationRoutes");
const agreementRoutes = require("./routes/agreementRoutes");
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require("./routes/authRoutes.js");

dotenv.config();

const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/cars',carRoutes);
app.use('/api/users',userRoutes);
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