const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const { changeRoleToOwner, getOwnerCars, getDashboardData, updateUserImage } = require('../controllers/ownerController');
const { removeCarOwner, addCar, toggleCarAvailability } = require('../controllers/carController');
const upload = require('../middleware/uploadMiddleware');
const { getOwnerBookings, changeBookingStatus } = require('../controllers/bookingController');
const router = express.Router();

router.post('/change-role',verifyToken, changeRoleToOwner)
router.get('/cars',verifyToken, getOwnerCars)
router.post('/add-car', verifyToken, upload.single('image'), addCar)
router.put('/toggle-cars',verifyToken, toggleCarAvailability)
router.post("/remove-car", verifyToken, removeCarOwner);
router.get('/dashboard', verifyToken, getDashboardData)
router.post('/update-image', verifyToken, upload.single('image'), updateUserImage)
router.get('/bookings',verifyToken,getOwnerBookings);
router.put('/change-status', verifyToken, changeBookingStatus)

module.exports = router;