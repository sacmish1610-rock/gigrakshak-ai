const express = require("express");
const router = express.Router();

const { createClaim } = require("../controllers/claimController");

// POST /api/claim
router.post("/", createClaim);

module.exports = router;