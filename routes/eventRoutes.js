const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../utils/verifyToken");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsBySearch,
} = require("../controller/eventCtrl");

// create event
router.post("/", verifyAdmin, createEvent);

// update event
router.put("/:eventId", verifyAdmin, updateEvent);

// delete event
router.delete("/:eventId", verifyAdmin, deleteEvent);

// get all events
router.get("/", getAllEvents);

// get event by id
router.get("/:eventId", getEventById);

// get all events by search
router.get("/search/getEventsBySearch", getEventsBySearch);

module.exports = router;
