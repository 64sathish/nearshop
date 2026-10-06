const mongoose = require("mongoose");

const connectDB = async() => {
    try {
        console.log("Connecting to MongoDB...");

        console.log(
            "MONGO_URI exists:",
            process.env.MONGO_URI ? "YES" : "NO"
        );

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:");
        console.error(error.message);
    }
};

module.exports = connectDB;