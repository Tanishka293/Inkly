const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.json());

// ✅ Configure CORS to allow your frontend
const allowedOrigin = "https://inkly-client.netlify.app";
app.use(cors({
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ Handle preflight requests
app.options("*", cors({
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Routes
app.use("/", blogRoutes);
app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

// Database
mongoose
  .connect(process.env.MONGO_URI, { dbName: "Inkly" })
  .then(() => console.log("MongoDB connected to Inkly DB"))
  .catch(err => console.error(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
