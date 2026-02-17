import { Search } from "../models/search.model.js";

export const createSearch = async (req, res, next) => {
  try {
    const { from, to, departureDate, returnDate, passengers, cabinClass } = req.body;

    if (!from || !to || !departureDate) {
      return res.status(400).json({ message: "From, to, and departureDate are required" });
    }

    const search = await Search.create({
      user: req.user._id,
      from,
      to,
      departureDate,
      returnDate,
      passengers,
      cabinClass
    });

    res.status(201).json({ search });
  } catch (error) {
    next(error);
  }
};

export const listMySearches = async (req, res, next) => {
  try {
    const searches = await Search.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ searches });
  } catch (error) {
    next(error);
  }
};
