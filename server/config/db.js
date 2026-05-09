const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});
const connectDB = async () => {
  try {
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected using process ");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};
// connectDB()
module.exports = connectDB;