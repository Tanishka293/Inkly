const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const blogRoutes = require("./routes/blogRoutes");



const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors({ origin: "*" })); // for now allow all

app.use("/", blogRoutes);

// ✅ Routes
app.use("/", authRoutes);

mongoose.connect(process.env.MONGO_URI, { dbName: "Inkly" })
  .then(() => console.log("MongoDB connected to Inkly DB"))
  .catch(err => console.error(err));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));