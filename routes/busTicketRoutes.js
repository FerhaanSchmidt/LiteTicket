const express = require("express");
const router = express.Router();
const { verifyAdmin, verifyCompany } = require("../utils/verifyToken");

const {
  createBusTicket,
  updateBusTicket,
  deleteBusTicket,
  getAllBusTickets,
  getBusTicketById,
  confirmBusTicketBooking,
  getBusBySearch,
} = require("../controller/busCtrl");

// create bus ticket
router.post("/", verifyCompany, createBusTicket);

// update bus ticket
router.put("/:busTicketId", updateBusTicket);

// delete bus ticket
router.delete("/:busTicketId", deleteBusTicket);

// get all bus ticketes
router.get("/", getAllBusTickets);

// get bus ticket by id
router.get("/:busTicketId", getBusTicketById);

// confirm bus ticket booking by id
router.get("/:busTicketId", confirmBusTicketBooking);

// get bus by search
router.get("/search/getBusBySearch", getBusBySearch);

module.exports = router;
