const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", // Reference the Event model
      required: true,
    },
    ticketType: {
      type: String,
      enum: ["General Admission", "VIP", "Early Bird"], // Use same types as Event
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Purchased", "Expired"],
    },
    qrCode: {
      type: String, // Store the QR code data (e.g., unique ID)
      required: true,
      unique: true, // Ensure each ticket has a unique QR code
    },
    purchasedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference the User model
    },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: Date.now + 48 * 60 * 60 * 1000 },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
