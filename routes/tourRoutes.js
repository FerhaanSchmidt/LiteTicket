const express = require("express");
const { verifyAdmin } = require("../utils/verifyToken");
const {
  createTour,
  updateTour,
  getTourById,
  getAllTours,
  deleteTour,
  getToursBySearch,
} = require("../controller/tourCtrl");
const router = express.Router();

// create tour
router.post("/", verifyAdmin, createTour);

// update tour
router.put("/:tourId", verifyAdmin, updateTour);

// delete tour
router.delete("/:tourId", verifyAdmin, deleteTour);

// get tour by id
router.get("/:tourId", getTourById);

// get all tours
router.get("/", getAllTours);

// get all tours by search
router.get("/search/getToursBySearch", getToursBySearch);

module.exports = router;
