const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Create uploads folder if it doesn't exist
const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

// Make uploaded images available
app.use("/uploads", express.static(uploadPath));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "NearShop Backend is running successfully",
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`NearShop server running on port ${PORT}`);
});