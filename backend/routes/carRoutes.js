const express = require('express')
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { getCars, addCar, updateCarStatus, deleteCar} = require('../controllers/carController.js')

router.get('/',verifyToken,getCars);
router.post('/',verifyToken,addCar);
router.put('/:id',verifyToken,updateCarStatus);
router.delete('/:id',verifyToken,deleteCar);

module.exports = router;