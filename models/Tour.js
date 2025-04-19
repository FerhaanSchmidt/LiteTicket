const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Trim leading/trailing whitespace
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String, // Consider using a dedicated time format
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    image: {
      type: String, // Store the image URL or file path
    },
    ticketPrices: [
      {
        type: {
          type: String,
          enum: ["General Admission", "VIP", "Early Bird"], // Define allowed ticket types
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
