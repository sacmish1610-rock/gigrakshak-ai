const express = require("express");
const router = express.Router();
const { getDashboardStats, getTriggerStats } = require("../controllers/analyticsController");

router.get("/dashboard", getDashboardStats);
router.get("/triggers", getTriggerStats);

module.exports = router;
