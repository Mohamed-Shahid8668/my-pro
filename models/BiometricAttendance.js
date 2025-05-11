const mongoose = require("mongoose");

const biometricAttendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", // assuming a Student model exists
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: null,
  },
  date: {
    type: String,
    required: true, // Format: 'YYYY-MM-DD'
  },
});

module.exports = mongoose.model("BiometricAttendance", biometricAttendanceSchema);
