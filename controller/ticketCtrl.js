const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_SECRET_KEY;
const qrcode = require("qrcode");
const Ticket = require("../models/Ticket");
const endpointSecret =
  "whsec_59ea187210cc7f29f823d16d7060a82aa64e1a0c4c622ff21a4bd5fd1e0dd09f";

// Create a new ticket
const createTicket = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // 1. Generate a unique QR code
    const qrCodeData = Math.random().toString(36).substring(2, 15); // Generate unique ID
    const qrCode = await qrcode.toDataURL(qrCodeData); // Create QR code
    // 2. Create the ticket
    const newTicket = new Ticket({
      ...req.body,
      qrCode: qrCodeData, // Store the unique ID as qrCode
    });
    await newTicket.save();
    // 3. Return the created ticket
    res.status(201).json(newTicket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

// Payment Processing
const purchaseProcessing = asyncHandler(async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    // (Optional) Check if ticket is available, etc.

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd", // Or your currency
            product_data: {
              name: ticket.ticketType,
              description: "Ticket for " + ticket.event.name,
            },
            unit_amount: ticket.price * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      // success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`, // Redirect after success
      // cancel_url: `${process.env.CLIENT_URL}/cancel`, // Redirect after cancellation
      success_url: "http://localhost", // Placeholder
      cancel_url: "https://example.com", // Placeholder
    });
    // Log the session ID for debugging
    console.log("Stripe Checkout Session ID:", session.id);

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error("Error creating Stripe checkout session:", err);
    res.status(500).json({ error: "Failed to create Stripe checkout session" });
  }
});

// const getStirpApiKey = asyncHandler(async (req, res, next) => {
//   res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
// });

// Get all tickets for a specific event
const getAllTickets = asyncHandler(async (req, res) => {
  try {
    const tickets = await Ticket.find({ event: req.params.eventId });
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

// Get a specific ticket by ID
const getTicketById = asyncHandler(async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
});

// -------------------------------------------------------------
const stripeWebhooks = asyncHandler(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const event = req.body;
  // Verify the webhook signature
  let eventObject;
  try {
    eventObject = stripe.webhooks.constructEvent(
      JSON.stringify(event),
      signature,
      `whsec_59ea187210cc7f29f823d16d7060a82aa64e1a0c4c622ff21a4bd5fd1e0dd09f`
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res
      .status(400)
      .send({ error: "Webhook signature verification failed." });
  }
  // Handle the event
  handleWebhookEvent(eventObject);
  res.status(200).send({ received: true });
});

const handleWebhookEvent = async (event) => {
  switch (event.type) {
    case "payment_intent.succeeded":
      await handleCheckoutSessionCompleted(event.data.object);
      break;
    case "payment_intent.failed":
      await handleCheckoutSessionFailed(event.data.object);
      break;
    // Add more event types as needed...
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};
const handleCheckoutSessionCompleted = async (event) => {
  // ... (Your logic here - update database, send email, etc.)
};
const handleCheckoutSessionFailed = (event) => {
  // ... (Your logic here - handle payment failure)
};
// -------------------------------------------------------------

module.exports = {
  createTicket,
  purchaseProcessing,
  stripeWebhooks,
  getAllTickets,
  getTicketById,
};
