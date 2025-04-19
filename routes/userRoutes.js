const express = require("express");
const { verifyUser, verifyAdmin } = require("../utils/verifyToken");
const router = express.Router();
const {
  updateUser,
  deleteUser,
  getUserById,
  getAllUsers,
} = require("../controller/userCtrl");

// update user
router.put("/:userId", verifyUser, updateUser);

// delete user
router.delete("/:userId", verifyUser, deleteUser);

// get user by id
router.get("/:userId", verifyUser, getUserById);

// get all user
router.get("/", verifyAdmin, getAllUsers);

module.exports = router;
