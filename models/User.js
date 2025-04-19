const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    purchaseHistory: [
      {
        ticket: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ticket", // Reference the Ticket model
          // required: true,
        },
        date: {
          type: Date,
          default: Date.now, // Set the date automatically
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
