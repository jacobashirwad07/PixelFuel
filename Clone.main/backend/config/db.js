import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("Please define the MONGODB_URI environment variable");
    }

    await mongoose.connect(uri);
    console.log("DB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the application with an error code
  }
};
