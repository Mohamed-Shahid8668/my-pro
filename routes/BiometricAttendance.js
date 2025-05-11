const express = require("express");
const router = express.Router();
const BiometricAttendance = require("../models/BiometricAttendance");
const authenticate = require("../middleware/Authenticate"); // JWT auth middleware

// Validate date format (YYYY-MM-DD)
const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

// GET /api/biometric-attendance?date=YYYY-MM-DD
router.get("/biometric-attendance", authenticate, async (req, res) => {
  const { date } = req.query;

  // Check if date query parameter is provided
  if (!date) {
    return res.status(400).json({ error: "Missing 'date' query parameter." });
  }

  // Validate date format
  if (!isValidDate(date)) {
    return res.status(400).json({ error: "Invalid date format. Use 'YYYY-MM-DD'." });
  }

  try {
    const records = await BiometricAttendance.find({ date });

    if (records.length === 0) {
      return res.status(404).json({ error: "No records found for the specified date." });
    }

    return res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching biometric attendance:", error);
    return res.status(500).json({ error: "Failed to fetch attendance records." });
  }
});

// POST /api/biometric-attendance
router.post("/biometric-attendance", authenticate, async (req, res) => {
  const { studentId, verified, timestamp } = req.body;

  // Validate required fields
  if (!studentId || typeof verified !== "boolean") {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const time = timestamp ? new Date(timestamp) : new Date();
  const dateStr = time.toISOString().split("T")[0]; // 'YYYY-MM-DD'

  try {
    // Check if already marked for this date
    const existing = await BiometricAttendance.findOne({ studentId, date: dateStr });
    if (existing) {
      return res.status(200).json({ message: "Attendance already recorded.", data: existing });
    }

    // Save new attendance record
    const newRecord = new BiometricAttendance({
      studentId,
      verified,
      timestamp: time,
      date: dateStr,
    });

    await newRecord.save();

    res.status(201).json({ message: "Attendance recorded successfully.", data: newRecord });
  } catch (error) {
    console.error("Error saving biometric attendance:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
