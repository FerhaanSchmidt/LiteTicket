const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Tour = require("../models/Tour");

// Create a new tour
const createTour = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const newTour = new Tour(req.body);
  try {
    const savedTour = await newTour.save();
    res.status(200).json({
      success: true,
      message: "Tour Successfully Created",
      data: savedTour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Faild To Created Tour ${error}`,
    });
  }
});

// Update tour
const updateTour = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = req.params.tourId;
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Tour Successfully Updated",
      data: updatedTour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Faild To Update Tour ${error}`,
    });
  }
});

// Delete tour
const deleteTour = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = req.params.tourId;

  try {
    await Tour.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Tour Successfully Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Faild To Delete Tour ${error}`,
    });
  }
});

// Get tour by id
const getTourById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = req.params.tourId;

  try {
    const tour = await Tour.findById(id);
    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: `Tour Not Found` });
    }
    res.status(200).json({
      success: true,
      message: "Tour Successfully Founded",
      data: tour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Faild To Find Tour Or, Tour Not Found ${error}`,
    });
  }
});

// Get All tours
const getAllTours = asyncHandler(async (req, res) => {
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
    const totalCount = await Tour.countDocuments(query);
    const tours = await Tour.find(query).skip(skip).limit(limit);

    if (!tours) {
      return res
        .status(404)
        .json({ success: false, message: `Tours Not Found, Something Wrong` });
    }
    res.status(200).json({
      success: true,
      message: "Tours Successfully Founded",
      count: totalCount,
      data: tours,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Faild To Find Tours Or, Tours Not Found ${error}`,
    });
  }
});

// get tour by search
const getToursBySearch = asyncHandler(async (req, res) => {
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
      query.capacity = capacity; // Assuming you want to search by capacity number
    } else {
      return res.status(400).json({
        success: false,
        message: "Capacity should be a valid number.",
      });
    }
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  try {
    const totalCount = await Tour.countDocuments(query);
    const tours = await Tour.find(query).skip(skip).limit(limit);

    if (!tours.length) {
      return res.status(404).json({
        success: false,
        message: "No Tours Found By Search, Try Again",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tours Successfully Found By Search",
      count: totalCount,
      data: tours,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed To Find Tours: ${error.message}`,
    });
  }
});

module.exports = {
  createTour,
  updateTour,
  deleteTour,
  getTourById,
  getAllTours,
  getToursBySearch,
};
