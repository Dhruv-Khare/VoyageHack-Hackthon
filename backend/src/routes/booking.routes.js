import { Router } from "express";
import {
  createBooking,
  listMyBookings,
  cancelBooking
} from "../controllers/booking.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createBooking);
router.get("/mine", authMiddleware, listMyBookings);
router.patch("/:id/cancel", authMiddleware, cancelBooking);

export const bookingRoutes = router;
