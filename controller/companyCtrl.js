const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const { Company, BusTicket } = require("../models/BusTicket"); // Assuming your schemas are exported from the models file

// Create a new company
const createCompany = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, contactNumber, email, address } = req.body;
  try {
    const company = new Company({
      name,
      contactNumber,
      email,
      address,
    });

    await company.save();
    return res.status(201).json({
      success: true,
      message: "Company Successfully Created",
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Faild To Created Company ${error}`,
    });
  }
});

// Update a company
const updateCompany = asyncHandler(async (req, res) => {
  const id = req.params.companyId;

  try {
    const updatedCompany = await Company.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found." });
    }
    return res.status(200).json({
      success: true,
      message: "Company Successfully Updated",
      data: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Faild To Update Company ${error}`,
    });
  }
});

// Delete a company
const deleteCompany = asyncHandler(async (req, res) => {
  const id = req.params.companyId;

  try {
    const deletedCompany = await Company.findByIdAndDelete(id);
    if (!deletedCompany) {
      return res.status(404).json({ message: "Company not found." });
    }
    return res.status(200).json({
      success: true,
      message: "Company Successfully Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Faild To Delete Company ${error}`,
    });
  }
});

// Get all companies
const getAllCompanies = asyncHandler(async (req, res) => {
  try {
    const companies = await Company.find();
    return res.status(200).json({
      success: true,
      message: "Companies Successfully",
      data: companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Faild To Get Companies ${error}`,
    });
  }
});

// Get a single company
const getCompanyById = asyncHandler(async (req, res) => {
  const id = req.params.companyId;

  try {
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }
    return res.status(200).json({
      success: true,
      message: "Company Successfully",
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Faild To Get Company ${error}`,
    });
  }
});

// Get all bus tickets for a specific company and include driver information
const getAllDriversByCompany = asyncHandler(async (req, res) => {
  const companyId = req.params.companyId;

  try {
    const buses = await BusTicket.find({ company: companyId })
      .populate("company")
      .sort({ startUpAt: +1 });

    // Extract unique drivers from the tickets
    const uniqueDrivers = [
      ...new Map(buses.map((bus) => [bus.driver._id, bus.driver])).values(),
    ];

    return res.status(200).json({
      success: true,
      message: "Drivers successfully fetched",
      data: uniqueDrivers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to get drivers: ${error.message}`,
    });
  }
});

// Get all bus tickets for a specific company with driver information
const getAllBusesByCompany = asyncHandler(async (req, res) => {
  const companyId = req.params.companyId;

  try {
    // Fetch all bus tickets for the specific company
    const buses = await BusTicket.find({ company: companyId })
      .populate("company")
      .populate("driver") // Populating the driver information
      .sort({ startUpAt: +1 }); // Sorting the results

    // Check if any buses were found
    if (buses.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No buses found for company with ID ${companyId}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Buses successfully fetched",
      data: buses, // Returning all bus data including driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to get buses: ${error.message}`,
    });
  }
});

module.exports = {
  createCompany,
  updateCompany,
  deleteCompany,
  getAllCompanies,
  getCompanyById,
  getAllDriversByCompany,
  getAllBusesByCompany,
};
