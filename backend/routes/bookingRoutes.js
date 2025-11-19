const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const { checkAvailabilityOfCar, createBooking, getUserBookings, getOwnerBookings, changeBookingStatus } = require('../controllers/bookingController');
const router = express.Router();

router.post('check-availabiity', checkAvailabilityOfCar);
router.post('/create', verifyToken, createBooking)
router.get('/user', verifyToken, getUserBookings)
router.get('/owner', verifyToken, getOwnerBookings)
router.put('/change-status', verifyToken, changeBookingStatus)

module.exports = router;