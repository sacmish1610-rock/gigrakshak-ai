const express = require("express");
const router = express.Router();
const { getPremium, getPlans } = require("../controllers/pricingController");

router.post("/", getPremium);
router.get("/plans", getPlans);

module.exports = router;