const express = require("express");
const router = express.Router();
const AttendanceByDate = require("../models/AttendanceByDate");
const Student = require("../models/Student");

// POST: Mark attendance for a student
router.post("/", async (req, res) => {
  try {
    const { studentId, status, date } = req.body;

    if (!studentId || !status || !date) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const parsedDate = new Date(date); // Ensure date is parsed properly

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    // Find the attendance record for the given date
    let attendanceRecord = await AttendanceByDate.findOne({ date: parsedDate });

    if (!attendanceRecord) {
      // If no attendance record exists for this date, create a new one
      attendanceRecord = new AttendanceByDate({
        date: parsedDate,
        attendance: [],
      });
    }

    // Check if the student attendance for the given date exists
    const studentAttendance = attendanceRecord.attendance.find(
      (entry) => entry.student.toString() === studentId
    );

    if (studentAttendance) {
      // If the student's attendance already exists, update it
      studentAttendance.status = status;
    } else {
      // If the student's attendance doesn't exist, add a new entry
      attendanceRecord.attendance.push({ student: studentId, status });
    }

    // Save the attendance record
    await attendanceRecord.save();

    res.status(200).json({
      message: "Attendance marked successfully.",
      attendance: attendanceRecord,
    });
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ error: "Failed to mark attendance. Please try again later." });
  }
});

// GET: Fetch attendance for a specific date
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    const parsedDate = new Date(date); // Ensure the date is parsed correctly

    const attendanceRecord = await AttendanceByDate.findOne({ date: parsedDate }).populate("attendance.student", "name studentId");

    if (!attendanceRecord) {
      return res.status(404).json({ message: "No attendance records found for this date." });
    }

    res.status(200).json({ attendance: attendanceRecord.attendance });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ error: "Failed to fetch attendance. Please try again later." });
  }
});

module.exports = router;
