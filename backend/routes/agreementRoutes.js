const express = require("express");
const router = express.Router();
const { getAgreements, addAgreement } = require("../controllers/agreementController");

router.get("/", getAgreements);
router.post("/", addAgreement);

module.exports = router;
