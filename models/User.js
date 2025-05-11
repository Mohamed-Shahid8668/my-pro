const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  databaseName: { type: String, required: true }, // Unique DB for each user
});

module.exports = mongoose.model("User", UserSchema);
