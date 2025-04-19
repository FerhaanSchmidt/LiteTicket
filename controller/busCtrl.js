const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid"); // Import UUID for unique ID generation
const { BusTicket, Company } = require("../models/BusTicket");

// Create a new bus ticket travel
const createBusTicket = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    from,
    to,
    startUpAt,
    estimatedArrivalAt,
    price,
    totalSeats,
    availableSeats,
    busNumber,
    driver,
    amenities,
    restStops,
  } = req.body;

  if (new Date(startUpAt) <= new Date()) {
    return res
      .status(400)
      .json({ message: "startUpAt must be a future date." });
  }

  try {
    const company = await Company.findById(req.companyId); // Use the verified company ID from middleware
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    // Validate availableSeats against totalSeats
    if (availableSeats > totalSeats) {
      return res
        .status(400)
        .json({ message: "Available seats cannot exceed total seats." });
    }

    const bookingID = uuidv4();

    const busTicket = new BusTicket({
      company: req.companyId, // Use the verified company ID
      from,
      to,
      startUpAt,
      estimatedArrivalAt,
      price,
      totalSeats,
      availableSeats,
      busNumber,
      driver,
      amenities,
      restStops,
      bookingID,
    });

    await busTicket.save();
    return res.status(201).json({
      success: true,
      message: "Bus Ticket Successfully Created",
      data: busTicket,
    });
  } catch (error) {
    console.error("Error creating bus ticket:", error);
    res.status(500).json({
      success: false,
      message: `Failed to create bus ticket: ${error.message}`,
    });
  }
});

// Update a bus ticket
const updateBusTicket = asyncHandler(async (req, res) => {
  const id = req.params.busTicketId;

  try {
    const busTicket = await await BusTicket.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!busTicket) {
      return res.status(404).json({
        success: false,
        message: "Bus Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bus Ticket Successfully Updated",
      data: busTicket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to update bus ticket: ${error.message}`,
    });
  }
});

// Delete a bus ticket
const deleteBusTicket = asyncHandler(async (req, res) => {
  const id = req.params.busTicketId;

  try {
    const deleteBusTicket = await BusTicket.findByIdAndDelete(id);

    if (!deleteBusTicket) {
      return res.status(404).json({
        success: false,
        message: "Bus Ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bus Ticket deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to delete bus ticket: ${error.message}`,
    });
  }
});

// Get all bus tickets
const getAllBusTickets = asyncHandler(async (req, res) => {
  try {
    const busTicket = await BusTicket.find()
      .populate("company")
      .sort({ startUpAt: +1 });

    return res.status(200).json({
      success: true,
      message: "Successfully",
      data: busTicket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to get buses ticketes: ${error.message}`,
    });
  }
});

// Get a bus ticket by ID
const getBusTicketById = asyncHandler(async (req, res) => {
  const id = req.params.busTicketId;

  try {
    const busTicket = await BusTicket.findById(id).populate("company");
    if (!busTicket) {
      return res.status(404).json({ message: "Bus ticket not found." });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully",
      data: busTicket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to get bus ticket: ${error.message}`,
    });
  }
});

// Confirm booking
const confirmBusTicketBooking = asyncHandler(async (req, res) => {
  const id = req.params.busTicketId;
  const { passengerDetails, seatNumber } = req.body;

  try {
    const busTicket = await BusTicket.findById(id);

    if (!busTicket) {
      return res.status(404).json({
        success: false,
        message: "Bus Ticket not found",
      });
    }

    await busTicket.confirmBooking(passengerDetails, seatNumber);
    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      data: busTicket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to confirm booking: ${error.message}`,
    });
  }
});

// Get Bus By Search
const getBusBySearch = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Create query object
  const query = {};

  // bus from
  if (req.query.from) {
    query.from = new RegExp(req.query.from, "i");
  }

  // bus to
  if (req.query.to) {
    query.to = new RegExp(req.query.to, "i");
  }

  // bus launch up at date and time
  if (req.query.startUpAt) {
    const startDate = new Date(req.query.startUpAt);
    if (!isNaN(startDate)) {
      query.startUpAt = { $gte: startDate }; // Adjust this based on your requirements
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid date format for startUpAt.",
      });
    }
  }

  // bus have available seats
  if (req.query.availableSeats) {
    const availableSeats = parseInt(req.query.availableSeats, 10);
    if (!isNaN(availableSeats)) {
      query.availableSeats = { $gte: availableSeats }; // Assuming you're interested in buses with at least this many seats
    } else {
      return res.status(400).json({
        success: false,
        message: "Capacity should be a valid number.",
      });
    }
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 8;
  const skip = (page - 1) * limit;

  try {
    const totalCount = await BusTicket.countDocuments(query);
    const buses = await BusTicket.find(query)
      .skip(skip)
      .limit(limit)
      .populate("company");

    if (!buses.length) {
      return res.status(404).json({
        success: false,
        message: "No Bus Found By Search, Try Again",
      });
    }

    res.status(200).json({
      success: true,
      message: "Buses Successfully Found By Search",
      count: totalCount,
      data: buses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed To Find Buses: ${error.message}`,
    });
  }
});

module.exports = {
  createBusTicket,
  updateBusTicket,
  deleteBusTicket,
  getAllBusTickets,
  getBusTicketById,
  confirmBusTicketBooking,
  getBusBySearch,
};
