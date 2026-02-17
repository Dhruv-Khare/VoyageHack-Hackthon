import { Booking } from "../models/booking.model.js";

export const createBooking = async (req, res, next) => {
  try {
    const { trip, passengers, totalPrice } = req.body;

    if (!trip || !trip.from || !trip.to || !trip.departureDate) {
      return res.status(400).json({ message: "Trip details are required" });
    }

    if (!Array.isArray(passengers) || passengers.length === 0) {
      return res.status(400).json({ message: "At least one passenger is required" });
    }

    if (totalPrice === undefined) {
      return res.status(400).json({ message: "Total price is required" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      trip,
      passengers,
      totalPrice
    });

    res.status(201).json({ booking });
  } catch (error) {
    next(error);
  }
};

export const listMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ booking });
  } catch (error) {
    next(error);
  }
};
