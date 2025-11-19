const express = require("express");
const router = express.Router();
const { register, login, getUser, getCars } = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/data", verifyToken, getUser);
router.get('/cars',getCars)

module.exports = router;
