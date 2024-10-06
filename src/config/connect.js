import mongoose from "mongoose";

export const connectDb = async (uri) => {
  try {
    const instance = await mongoose.connect(uri);
    console.log(`DB connected on ${instance.connection.host}`);
  } catch (error) {
    console.log("Data connection error", error);
  }
};
