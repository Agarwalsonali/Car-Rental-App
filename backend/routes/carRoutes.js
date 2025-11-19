const express = require('express')
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { getCars, deleteCar, getCarById} = require('../controllers/carController.js')

router.get('/', getCars);
router.get('/:id',getCarById);
router.delete('/delete-car',verifyToken,deleteCar);

module.exports = router;