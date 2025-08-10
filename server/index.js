const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.json());

// ✅ Proper CORS configuration for your Netlify client
app.use(
  cors({
    origin: "https://inkly-client.netlify.app", // your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Test endpoint
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

// ✅ Routes (note: first argument MUST be a path, not a URL)
app.use("/", blogRoutes);
app.use("/", authRoutes);

// Database connection
mongoose
  .connect(process.env.MONGO_URI, { dbName: "Inkly" })
  .then(() => console.log("✅ MongoDB connected to Inkly DB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
