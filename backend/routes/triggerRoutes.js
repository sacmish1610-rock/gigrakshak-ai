const express = require("express");
const router = express.Router();

const { runTrigger } = require("../controllers/triggerController");

// POST /api/trigger
router.post("/", runTrigger);

module.exports = router;