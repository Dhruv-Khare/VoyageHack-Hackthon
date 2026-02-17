import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    trip: {
      from: { type: String, required: true, trim: true },
      to: { type: String, required: true, trim: true },
      departureDate: { type: Date, required: true },
      returnDate: { type: Date }
    },
    passengers: {
      type: [passengerSchema],
      validate: {
        validator: (value) => value.length > 0,
        message: "At least one passenger is required"
      }
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed"
    }
  },
  {
    timestamps: true
  }
);

export const Booking = mongoose.model("Booking", bookingSchema);
