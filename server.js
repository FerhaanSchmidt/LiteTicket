const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const connectDb = require("./config/db");
connectDb();

const cors = require("cors");

const PORT = process.env.PORT || 5000;
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true, // Allow cookies
    // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// The router
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const tourRoutes = require("./routes/tourRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const userRoutes = require("./routes/userRoutes");
const busTicketRoutes = require("./routes/busTicketRoutes");
const companyRoutes = require("./routes/companyRoutes");
const bookingTourRoutes = require("./routes/bookingTourRoutes");

// The app useing
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/tickets", ticketRoutes);
app.use("/api/v1/bookingTour", bookingTourRoutes);
app.use("/api/v1/bus", busTicketRoutes);
app.use("/api/v1/company", companyRoutes);

// The app listing
app.listen(PORT, () => {
  console.log(`Server is running with ${PORT}`);
});
