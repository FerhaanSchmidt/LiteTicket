const mongoose = require("mongoose");

const bookingTourSchema = new mongoose.Schema(
  {
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour", // Reference the Tour model
      required: true,
    },
    // ticketType: {
    //   type: String,
    //   enum: ["General Admission", "VIP", "Early Bird"], // Use same types as Event
    //   required: true,
    // },
    // price: {
    //   type: Number,
    //   required: true,
    // },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Purchased", "Expired"],
      //   required: true,
    },
    // qrCode: {
    //   type: String, // Store the QR code data (e.g., unique ID)
    //   required: true,
    //   unique: true, // Ensure each ticket has a unique QR code
    // },
    // purchasedBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User", // Reference the User model
    // },
    bookAt: { type: Date, default: Date.now() },
    expiresAt: { type: Date, default: Date.now() + 24 * 60 * 60 * 1000 },
  },
  { timestamps: true }
);

const BookingTour = mongoose.model("BookingTour", bookingTourSchema);
module.exports = BookingTour;
