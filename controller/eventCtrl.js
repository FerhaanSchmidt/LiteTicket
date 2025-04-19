const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Event = require("../models/Event");

// Create a new event
const createEvent = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const newEvent = new Event(req.body);
  try {
    const savedEvent = await newEvent.save();
    res.status(200).json({
      success: true,
      message: "Event Successfully Created",
      data: savedEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Faild To Created Event ${error}`,
    });
  }
});

// Update an event
const updateEvent = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = req.params.eventId;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json({
      success: true,
      message: "Event Successfully Updated",
      data: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Faild To Update Event ${error}`,
    });
  }
});

// Delete an event
const deleteEvent = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = req.params.eventId;
  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json({
      success: true,
      message: "Event Successfully Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Faild To Delete Event ${error}`,
    });
  }
});

// Get a specific event by ID
const getEventById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = req.params.eventId;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: `Event Not Found` });
    }
    res.status(200).json({
      success: true,
      message: "Event Successfully Founded",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Faild To Find Event Or, Event Not Found ${error}`,
    });
  }
});

// Get all events
const getAllEvents = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Create query object
  const query = {};

  // for pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  try {
    const totalCount = await Event.countDocuments(query);
    const events = await Event.find(query).skip(skip).limit(limit);

    if (!events) {
      return res
        .status(404)
        .json({ success: false, message: `Events Not Found, Something Wrong` });
    }
    res.status(200).json({
      success: true,
      message: "Events Successfully Founded",
      count: totalCount,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Faild To Find Events Or, Events Not Found ${error}`,
    });
  }
});

// get event by search
const getEventsBySearch = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Create query object
  const query = {};
  if (req.query.name) {
    query.name = new RegExp(req.query.name, "i");
  }
  if (req.query.location) {
    query.location = new RegExp(req.query.location, "i");
  }
  if (req.query.capacity) {
    const capacity = parseInt(req.query.capacity);
    if (!isNaN(capacity)) {
      query.capacity = capacity;
    }
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  try {
    const totalCount = await Event.countDocuments(query);
    const events = await Event.find(query).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      message: "Events Successfully Found By Search",
      count: totalCount, // Return total count
      data: events,
    });
    d;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed To Find Events: ${error.message}`,
    });
  }
});

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsBySearch,
};
