const express = require("express");
const { verifyUser, verifyAdmin } = require("../utils/verifyToken");
const {
  createBookingTour,
  deleteBookingTour,
  getBookingTourById,
  getAllBookingTour,
} = require("../controller/bookingTourCtrl");
const router = express.Router();

// create booking tour
router.post("/", verifyUser, createBookingTour);

// // update booking tour
// router.put("/:bookingTourId", updateTour);

// delete booking tour
router.delete("/:bookingTourId", verifyUser, deleteBookingTour);

// get booking tour by id
router.get("/:bookingTourId", verifyUser, getBookingTourById);

// get all booking tours
router.get("/", verifyAdmin, getAllBookingTour);

module.exports = router;
