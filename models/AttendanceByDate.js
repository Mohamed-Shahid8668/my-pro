const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  attendance: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
      status: { type: String, enum: ['present', 'absent'], required: true }
    }
  ]
});

const AttendanceByDate = mongoose.model('AttendanceByDate', attendanceSchema);

module.exports = AttendanceByDate;
