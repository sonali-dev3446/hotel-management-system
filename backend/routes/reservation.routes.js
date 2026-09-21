import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import {
  createReservation,
  getReservations,
  getReservation,
  updateReservation,
  deleteReservation,
} from "../controllers/reservation.controller.js";

const reservationRouter = express.Router();

reservationRouter.get("/", authMiddleware, getReservations);

reservationRouter.get("/:id", authMiddleware, getReservation);

reservationRouter.post("/", authMiddleware, createReservation);

reservationRouter.put("/:id", authMiddleware, updateReservation);

reservationRouter.delete("/:id", authMiddleware, deleteReservation);

export default reservationRouter;