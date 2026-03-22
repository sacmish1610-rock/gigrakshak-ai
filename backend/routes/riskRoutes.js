const express = require("express");
const router = express.Router();

const { getRisk } = require("../controllers/riskController");

// POST /api/risk
router.post("/", getRisk);

module.exports = router;