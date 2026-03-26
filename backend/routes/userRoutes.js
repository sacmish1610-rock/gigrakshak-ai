const express = require("express");
const router = express.Router();
const { registerUser, getProfile, updateProfile, getAllUsers } = require("../controllers/userController");

router.post("/register", registerUser);
router.get("/:id", getProfile);
router.put("/:id", updateProfile);
router.get("/", getAllUsers);

module.exports = router;