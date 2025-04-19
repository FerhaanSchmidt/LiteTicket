const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  createTicket,
  purchaseProcessing,
  stripeWebhooks,
  getAllTickets,
  getTicketById,
} = require("../controller/ticketCtrl");

router.post(
  "/",
  [
    body("event").isMongoId(),
    body("ticketType").isIn(["General Admission", "VIP", "Early Bird"]),
    body("price").isNumeric(),
  ],
  createTicket
);

router.post("/:ticketId/purchase", purchaseProcessing);
router.post(
  "/stripe/webhooks",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

router.get("/event/:eventId", getAllTickets);
router.get("/:ticketId", getTicketById);

module.exports = router;
