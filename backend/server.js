const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const riskRoutes = require("./routes/riskRoutes");
const pricingRoutes = require("./routes/pricingRoutes");

const app = express();

// 🔹 Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/pricing", pricingRoutes);

// 🔹 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error ❌", err));

// 🔹 Test Route
app.get("/", (req, res) => {
  res.send("GigRakshak AI Backend Running 🚀");
});

// 🔹 Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});