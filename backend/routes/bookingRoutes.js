const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const { checkAvailabilityOfCar, createBooking, getUserBookings} = require('../controllers/bookingController');
const router = express.Router();

router.post('check-availabiity', checkAvailabilityOfCar);
router.post('/create', verifyToken, createBooking)
router.get('/user', verifyToken, getUserBookings)


module.exports = router;