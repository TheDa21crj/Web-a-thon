require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
    });
    console.log("Database Connected");
  } catch (error) {
    console.log("Database connection error");
    console.log(error);
  }
};

module.exports = connectDB;
