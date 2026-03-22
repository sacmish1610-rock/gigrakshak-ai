const express = require("express");
const router = express.Router();

const { getPremium } = require("../controllers/pricingController");

// POST /api/pricing
router.post("/", getPremium);

module.exports = router;