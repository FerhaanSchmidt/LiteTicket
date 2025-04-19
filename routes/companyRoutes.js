const express = require("express");
const router = express.Router();
const {
  verifyCompany,
  verifyAdmin,
  verifyToken,
} = require("../utils/verifyToken");

const {
  createCompany,
  updateCompany,
  deleteCompany,
  getAllCompanies,
  getCompanyById,
  getAllDriversByCompany,
  getAllBusesByCompany,
} = require("../controller/companyCtrl");

// create company
router.post("/", createCompany);

// update company
router.put("/:companyId", updateCompany);

// delete company
router.delete("/:companyId", deleteCompany);

// get all companyies
router.get("/", getAllCompanies);

// get company by id
router.get("/:companyId", getCompanyById);

// get drivers by companyId
router.get("/drivers/company/:companyId", getAllDriversByCompany);

// get all buses by companyId
router.get("/buses/:companyId", getAllBusesByCompany);

module.exports = router;
