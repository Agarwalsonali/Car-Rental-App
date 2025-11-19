const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const { changeRoleToOwner, getOwnerCars, getDashboardData, updateUserImage } = require('../controllers/ownerController');
const { removeCarOwner, addCar, toggleCarAvailability } = require('../controllers/carController');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/change-role',verifyToken, changeRoleToOwner)
router.get('/cars',verifyToken, getOwnerCars)
router.post('/add-car',upload.single('image'),verifyToken, addCar)
router.put('/toggle-cars',verifyToken, toggleCarAvailability)
router.delete('delete-car',verifyToken,removeCarOwner)
router.get('/dashboard', verifyToken, getDashboardData)
router.post('update-image', upload.single('image'), verifyToken, updateUserImage)

module.exports = router;