const mongoose = require("mongoose");

const connectUserDB = async (userId) => {
  const dbName = `user_${userId}`; // Unique DB for each user
  const dbUri = `mongodb://localhost:27017/${dbName}`;
  
  const connection = await mongoose.createConnection(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

};

module.exports = { connectUserDB };
