const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { Company } = require("../models/BusTicket");

// User Registration
const userRegister = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // 1. Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt); // 10 rounds of hashing

    // 2. Create the new user
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword, // Store the hashed password
    });

    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      // Duplicate key error (email)
      return res
        .status(400)
        .json({ error: "Email already exists", message: message.err });
    }

    res
      .status(500)
      .json({ error: "Failed to register user", message: message.err });
  }
});

// User Login
const userLogin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Attempt to find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid Credentials",
      });
    }

    // Compare provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Email Or Password",
        error: "Invalid Credentials",
      });
    }

    // Create JWT token
    const { password: _, ...userData } = user._doc; // omit password from user data
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15d" }
    );

    // Set token in cookie and send response
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      })
      .status(200)
      .json({
        success: true,
        message: "Successfully Logged In",
        token,
        data: { ...userData }, // return all user data except password
        role: user.role,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to Log in" });
  }
});

// User Registration
const companyRegister = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // 1. Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt); // 10 rounds of hashing

    // 2. Create the new Company
    const newCompany = new Company({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword, // Store the hashed password
      contactNumber: req.body.contactNumber,
      address: req.body.address,
    });

    await newCompany.save();

    res
      .status(201)
      .json({ success: true, message: "Company registered successfully" });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      // Duplicate key error (email)
      return res
        .status(400)
        .json({ error: "Email already exists", message: message.err });
    }

    res
      .status(500)
      .json({ error: "Failed to register company", message: message.err });
  }
});

// Company Login
const companyLogin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ email }); // Ensure company role matches , role: "company"

    if (!company) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid Credentials !" });
    }

    const { password: _, ...companyData } = company._doc;
    const token = jwt.sign(
      { id: company._id, role: company.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15d" }
    );

    res.cookie("accessToken", token, {
      httpOnly: false,
      secure: false, // Set to true if you're using HTTPS
      // sameSite: "None",
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({
      message: "Successfully Logged In",
      token,
      data: { ...companyData },
      role: company.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to Log in" });
  }
});

module.exports = {
  userRegister,
  userLogin,
  companyRegister,
  companyLogin,
};
