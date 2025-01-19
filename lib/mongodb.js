import mongoose from "mongoose";

export const connectMongoDB = async () => {
    try {
        const connectToMongoDB = await mongoose.connect(process.env.MONGODB_URI)

        if (connectToMongoDB.ok) {
            console.log("connect to mongodb successfully")
            return;
        }
    } catch (error) {
        console.log("Error connecting to MongoDB: ", error)
    }
}