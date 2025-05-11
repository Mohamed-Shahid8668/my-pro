require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendance");
const biometricAttendanceRoutes = require("./routes/BiometricAttendance");

const app = express();

// Constants
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/attendanceDB";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api", biometricAttendanceRoutes);


// Serve uploads (profile images, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve React frontend if available
const reactBuildPath = path.join(__dirname, "frontend", "build");
app.use(express.static(reactBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(reactBuildPath, "index.html"));
});

// Database Connection
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  });

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});
