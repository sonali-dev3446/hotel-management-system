import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectToMongoDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import reservationRouter from "./routes/reservation.routes.js";
dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());

// Routes
server.use("/auth", authRouter);
server.use("/reservations", reservationRouter);

// Home route
server.get("/", (req, res) => {
  res.send("Hotel Reservation API Running...");
});

// 404
server.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Not Found",
  });
});

// Start server only after DB connection
const startServer = async () => {
  try {
    await connectToMongoDB();

    console.log("✅ Database Connected");

    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("❌ Database Connection Failed");
    console.error(err);
  }
};

startServer();