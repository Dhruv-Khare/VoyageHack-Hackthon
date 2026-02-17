import mongoose from "mongoose";

const searchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    from: {
      type: String,
      required: true,
      trim: true
    },
    to: {
      type: String,
      required: true,
      trim: true
    },
    departureDate: {
      type: Date,
      required: true
    },
    returnDate: {
      type: Date
    },
    passengers: {
      type: Number,
      default: 1,
      min: 1
    },
    cabinClass: {
      type: String,
      enum: ["economy", "premium_economy", "business", "first"],
      default: "economy"
    }
  },
  {
    timestamps: true
  }
);

export const Search = mongoose.model("Search", searchSchema);
