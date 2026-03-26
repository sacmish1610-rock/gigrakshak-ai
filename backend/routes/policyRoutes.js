const express = require("express");
const router = express.Router();
const { buyPolicy, getUserPolicies, getPolicyById, renewPolicy, cancelPolicy } = require("../controllers/policyController");

router.post("/buy", buyPolicy);
router.get("/user/:userId", getUserPolicies);
router.get("/:id", getPolicyById);
router.post("/renew/:id", renewPolicy);
router.put("/cancel/:id", cancelPolicy);

module.exports = router;