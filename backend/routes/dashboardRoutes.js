const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('../controllers/dashboardController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/summary',verifyToken, getDashboardSummary);
module.exports = router;
