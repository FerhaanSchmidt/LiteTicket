const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const User = require("../models/User");

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = req.params.userId;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "User Successfully Updated",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Faild To Update User ${error}`,
    });
  }
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = req.params.userId;

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "User Successfully Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Faild To Delete User ${error}`,
    });
  }
});

// Get User by id
const getUserById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = req.params.userId;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: `User Not Found` });
    }
    res.status(200).json({
      success: true,
      message: "User Successfully Founded",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Faild To Find User Or, User Not Found ${error}`,
    });
  }
});

// Get All Users
const getAllUsers = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const users = await User.find({});

    if (!users) {
      return res
        .status(404)
        .json({ success: false, message: `Users Not Found, Something Wrong` });
    }
    res.status(200).json({
      success: true,
      message: "Users Successfully Founded",
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Faild To Find Users Or, Users Not Found ${error}`,
    });
  }
});

module.exports = {
  updateUser,
  deleteUser,
  getUserById,
  getAllUsers,
};
