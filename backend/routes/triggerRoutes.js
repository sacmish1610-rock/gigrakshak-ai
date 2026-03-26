const express = require("express");
const router = express.Router();
const { runTrigger, checkTrigger, simulateDisruption } = require("../controllers/triggerController");

router.post("/", runTrigger);
router.post("/check", checkTrigger);
router.post("/simulate", simulateDisruption);

module.exports = router;