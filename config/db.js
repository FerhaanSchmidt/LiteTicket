const mongoose = require("mongoose");
const { initialize } = require("../controller/bookingTourCtrl"); // Adjust the path

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connectDb successfully");

    // Initialize bookings cleanup
    initialize();
  } catch (error) {
    console.log("Faild to connect Db ..!");
    console.error();
    process.exit(1);
  }
};
module.exports = connectDB;
