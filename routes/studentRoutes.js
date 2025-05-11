const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Fetch Only the Logged-in User's Students
router.get("/", authMiddleware, async (req, res) => {
  try {
    const students = await Student.find({ userId: req.user.id }); // ✅ Only get students of logged-in user
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Error fetching students" });
  }
});

// ✅ Add a New Student (POST Request)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, registerNumber, classYear, semester } = req.body;
    
    const newStudent = new Student({
      name,
      registerNumber,
      classYear,
      semester,
      userId: req.user.id, // ✅ Attach logged-in user's ID
    });

    await newStudent.save();
    res.status(201).json({ message: "Student added successfully", student: newStudent });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Update Student Details
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // ✅ Ensure only user's student is updated
      req.body,
      { new: true }
    );
    if (!updatedStudent) return res.status(404).json({ error: "Student not found" });
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: "Error updating student" });
  }
});

// ✅ Delete a Student
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedStudent = await Student.findOneAndDelete({ _id: req.params.id, userId: req.user.id }); // ✅ Delete only if owned by user
    if (!deletedStudent) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting student" });
  }
});

// ✅ Search Students by Name & Register Number (Only for Logged-in User)
router.get("/search", authMiddleware, async (req, res) => {
  try {
    const query = req.query.q;
    const students = await Student.find({
      userId: req.user.id, // ✅ Only search user's students
      $or: [
        { name: { $regex: query, $options: "i" } },
        { registerNumber: { $regex: query, $options: "i" } },
      ],
    });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Error searching students" });
  }
});

module.exports = router;
