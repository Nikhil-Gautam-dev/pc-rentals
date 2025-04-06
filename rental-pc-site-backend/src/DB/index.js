import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const URI =
      process.env.MONGO_URI + process.env.MONGO_DB + process.env.MONGO_OPTIONS;
    const conn = await mongoose.connect(URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};
