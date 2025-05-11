const mongoose = require("mongoose"); // Import schemas // ✅ Use correct case
const { db } = require("../models/User");

const connections = {}; // Store user database connections

// ✅ Function to connect to a specific user database
const db = async (databaseName) => {
  if (connections[databaseName]) {
    return connections[databaseName]; // Return existing connection if available
  }

  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/";
  const dbURI = `${MONGO_URI}${databaseName}`;

  try {
    const conn = await mongoose.createConnection(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // ✅ Register models for this user database
    connections[databaseName] = {
      connection: conn,
      // ✅ Ensure correct collection name
      Profile: conn.model("profile", profileSchema, "profiles"), // ✅ Ensure correct collection name
    };

    console.log(`✅ Connected to User Database: ${databaseName}`);
    return connections[databaseName];
  } catch (err) {
    console.error("❌ User DB Connection Error:", err);
    throw new Error("Database connection failed");
  }
};

module.exports = { db };
