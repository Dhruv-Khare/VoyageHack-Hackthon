import mongoose from "mongoose";

const connectDb = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
};

export { connectDb };
