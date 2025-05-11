const mongoose = require("mongoose");


const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registerNumber: { type: String, required: true },
  classYear: { type: String, required: true },
  semester: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});


module.exports = mongoose.model("Student", studentSchema);
