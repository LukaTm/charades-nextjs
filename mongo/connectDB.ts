import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const databaseURL = process.env.DATABASE_URL;
        if (!databaseURL) {
            throw new Error("DATABASE_URL environment variable is not defined");
        }
        await mongoose.connect(databaseURL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
    }
};

export default connectDB;
