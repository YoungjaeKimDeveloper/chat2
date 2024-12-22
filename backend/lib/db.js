import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MONGODB CONNECTED✅");
  } catch (error) {
    console.log("Failed to connect DB", error.message);
  }
};
