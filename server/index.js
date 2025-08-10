
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routes
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.json());


app.use(cors({ origin: "*" }));


app.use("/blogs", blogRoutes); 
app.use("/auth", authRoutes);  

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { dbName: "Inkly" })
  .then(() => console.log("✅ MongoDB connected to Inkly DB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("🚀 Inkly API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
