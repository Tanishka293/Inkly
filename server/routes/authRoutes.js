const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =============================
//  Middleware: Verify JWT Token
// =============================
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log("Auth Header:", authHeader); // ✅ Debug

  if (!authHeader) return res.status(401).json({ message: "Access Denied" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("Token Error:", err.message);
    res.status(400).json({ message: "Invalid Token" });
  }
}


// =============================
//  Signup Route
// =============================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// =============================
//  Login Route
// =============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // 2️⃣ Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // 3️⃣ Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// =============================
//  Get Logged-in User
// =============================
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Fetch User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
