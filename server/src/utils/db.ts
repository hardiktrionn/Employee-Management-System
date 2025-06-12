import mongoose from "mongoose";

/**
 * Function Name: connectDB
 *
 * Description:
 * The function a connect with mongodb.
 *
 * Example Usage:
 * ```
 *  connectDB();
 * ```
 */
const connectDB = async (): Promise<void> => {
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not defined in environment variables");
  }
  await mongoose.connect(process.env.MONGO_URL);
  console.log("MongoDB connected successfully");
};

export default connectDB;
