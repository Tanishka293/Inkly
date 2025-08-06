const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" })); // allow all for now

// Routes
app.use("/", blogRoutes);
app.use("/", authRoutes);

// Database
mongoose
  .connect(process.env.MONGO_URI, { dbName: "Inkly" })
  .then(() => console.log("MongoDB connected to Inkly DB"))
  .catch(err => console.error(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
