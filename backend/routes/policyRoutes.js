const express = require("express");
const router = express.Router();

const { buyPolicy } = require("../controllers/policyController");

// POST /api/policy/buy
router.post("/buy", buyPolicy);

module.exports = router;