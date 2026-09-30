
import mongoose from "mongoose";

export const connectDb = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("MONGODB_URI is missing. Add it to backend/.env.");
    }

    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(uri);
    }
};
