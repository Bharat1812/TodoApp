//database configuration

const mongoose = require("mongoose");
const mongoUrl = "mongodb://localhost:27017/todoApp";

async function connect() {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

function getDb() {
  return mongoose.connection;
}

module.exports = {
  connect,
  getDb,
};
