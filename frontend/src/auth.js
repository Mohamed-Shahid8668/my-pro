const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const User = require("../models/User");
const controller =require("../controller/authcontroller")
const { connectUserDB } = require("../db/connectUserDB");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const otpStorage = {}; // Temporary OTP storage (use Redis/DB in production)

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const EMAIL_USER = process.env.EMAIL_USER || "your-email@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "your-email-password";

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

// ✅ Request OTP (Sends OTP to Email)
router.post("/request-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStorage[email] = otp;

  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    });

    res.json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Error sending OTP" });
  }
});

// ✅ Signup with Dynamic Database Creation
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    if (otpStorage[email] !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    delete otpStorage[email]; // Remove used OTP

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already in use!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate a unique database name for the user
    const databaseName = `user_${Date.now()}`;

    // ✅ Create new user with their own database
    const newUser = new User({ name, email, password: hashedPassword, databaseName });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Server error, try again later." });
  }
});

// ✅ Login and Provide User-Specific Database Info
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    console.log("🟢 User ID:", user._id); // Debugging: Check if different for each user

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log("✅ Generated Token:", token); // Debugging: Check if different per user

    res.json({ token, user });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    console.log("Connecting to user DB for:", req.user.id); // ✅ Debugging

    const { Profile } = await connectUserDB(req.user.id); // 🔥 Connect to user DB
    const userProfile = await Profile.findOne({ userId: req.user.id });

    if (!userProfile) return res.status(404).json({ error: "Profile not found" });

    res.json(userProfile);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
