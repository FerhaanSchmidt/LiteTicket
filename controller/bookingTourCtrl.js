const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const BookingTour = require("../models/BookingTour");

// Create booking tour
const createBookingTour = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newBookingTour = new BookingTour(req.body);

  try {
    // Save the new booking
    const savedBookingTour = await newBookingTour.save();

    // Populate the tour details
    const populatedBookingTour = await BookingTour.findById(
      savedBookingTour._id
    ).populate("tourId", "name"); // Replace 'name' with the actual field name of the tour you want to populate

    res.status(200).json({
      success: true,
      message: "Booking Tour Successfully Created",
      data: populatedBookingTour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed To Create Booking Tour: ${error.message}`, // Changed "Faild" to "Failed" and used error.message
    });
  }
});

// Get booking tour by id
const getBookingTourById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.bookingTourId;

  try {
    const bookingTour = await BookingTour.findById(id).populate(
      "tourId",
      "name"
    );

    if (!bookingTour) {
      return res
        .status(404)
        .json({ success: false, message: `Booking Tour Not Found` });
    }

    res.status(200).json({
      success: true,
      message: "Get Booking Tour By Id Successfully",
      data: bookingTour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed To Get Booking Tour: ${error.message}`,
    });
  }
});

// Get booking tour by id
const getAllBookingTour = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const bookingTour = await BookingTour.find().populate("tourId", "name");

    if (!bookingTour) {
      return res
        .status(404)
        .json({ success: false, message: `Booking Tour Not Found` });
    }

    res.status(200).json({
      success: true,
      message: "Get All Booking Tour Successfully",
      count: bookingTour.length,
      data: bookingTour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed To Get Booking Tour: ${error.message}`,
    });
  }
});

// Delete booking tour
const deleteBookingTour = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = req.params.bookingTourId;

  try {
    const bookingTour = await BookingTour.findByIdAndDelete(id);

    if (!bookingTour) {
      return res
        .status(404)
        .json({ success: false, message: `Booking Tour Not Found` });
    }

    res.status(200).json({
      success: true,
      message: "Booking Tour Deleted Successfully",
      data: bookingTour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed To Delete Booking Tour: ${error.message}`,
    });
  }
});

// Function to remove expired bookings
const removeExpiredBookings = async () => {
  try {
    const now = new Date();
    const result = await BookingTour.deleteMany({
      expiresAt: { $lt: now }, // Find bookings where the expiry date is less than now
    });
    console.log(`Removed ${result.deletedCount} expired bookings.`);
  } catch (error) {
    console.error("Error removing expired bookings:", error);
  }
};

// Call this function on server start
const initialize = async () => {
  // You can call removeExpiredBookings here if you want to clean up old bookings at startup.
  await removeExpiredBookings();

  // Optionally, set an interval to run the cleanup function every hour or any other interval
  setInterval(removeExpiredBookings, 60 * 1000); // Run every minute
};

module.exports = {
  createBookingTour,
  deleteBookingTour,
  getBookingTourById,
  getAllBookingTour,
  initialize,
};
