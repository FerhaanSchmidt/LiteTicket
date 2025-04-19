const mongoose = require("mongoose");

// Company schema
const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
    },
    password: {
      type: String,
      required: true,
    },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

// Driver schema for unique drivers
const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  phone: { type: String, required: true },
});

// Passenger schema
const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
  },
  phone: { type: String, required: true },
});

// Seat schema for individual seat details
const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  booked: { type: Boolean, default: false },
});

// Main Bus Ticket Schema
const busTicketSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    from: { type: String, required: true },
    to: { type: String, required: true },
    startUpAt: { type: Date, required: true },
    estimatedArrivalAt: { type: Date },
    price: { type: Number, required: true, min: 0 },
    totalSeats: { type: Number, required: true, min: 1 },
    availableSeats: { type: Number, required: true, min: 0 },
    seats: [seatSchema],
    passenger: passengerSchema,
    status: {
      type: String,
      enum: ["active", "completed", "canceled"],
      default: "active",
    },
    bookingID: { type: String, unique: true }, // Ensure that this field is unique
    busNumber: { type: String, required: true, unique: true }, // Unique bus number for each bus
    driver: driverSchema, // Embed driver schema
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deleted: { type: Boolean, default: false },
    version: { type: Number, default: 1 },
    amenities: {
      wifi: { type: Boolean, default: false },
      chargingSocket: { type: Boolean, default: false },
      food: { type: Boolean, default: false },
      water: { type: Boolean, default: false },
    },
    restStops: [
      {
        name: { type: String, required: true },
        duration: { type: Number, required: true },
        location: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

// // Instance methods to manage complex operations
// busTicketSchema.methods.confirmBooking = async function (
//   passengerDetails,
//   seatNumber
// ) {
//   // Check if the seat is already booked
//   const seat = this.seats.find((seat) => seat.seatNumber === seatNumber);

//   if (!seat) {
//     throw new Error("Seat not found.");
//   }

//   if (seat.booked) {
//     throw new Error("Seat already booked.");
//   }

//   // Set the seat to booked
//   seat.booked = true;

//   // Update passenger details
//   this.passenger = passengerDetails;

//   // Decrease available seats
//   this.availableSeats -= 1;

//   // Save changes to the database
//   await this.save();
// };

// Indexing for performance
busTicketSchema.index({ from: 1, to: 1, startUpAt: 1 });

// Exporting the models
const Company = mongoose.model("Company", companySchema);
const BusTicket = mongoose.model("BusTicket", busTicketSchema);
const Driver = mongoose.model("Driver", driverSchema); // Optionally export if you utilize this model separately

module.exports = { Company, BusTicket, Driver }; // Export additional models if needed
