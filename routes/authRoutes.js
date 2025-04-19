const express = require("express");
const { body } = require("express-validator");
const {
  userRegister,
  userLogin,
  companyRegister,
  companyLogin,
} = require("../controller/authCtrl");
const { verifyCompany, verifyUser } = require("../utils/verifyToken");
const router = express.Router();

// Register User
router.post("/register", userRegister);

// Login User
router.post("/login", userLogin);

// Register User
router.post("/register/company", companyRegister);

// Login company
router.post("/login/company", companyLogin);

module.exports = router;
