const express = require("express");
const router = express.Router();
const { createClaim, autoClaimProcessing, getClaimHistory, getClaimStats } = require("../controllers/claimController");

router.post("/", createClaim);
router.post("/auto", autoClaimProcessing);
router.get("/user/:userId", getClaimHistory);
router.get("/stats/:userId", getClaimStats);

module.exports = router;