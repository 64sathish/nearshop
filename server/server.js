const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());

app.use(express.json());


app.use(
    express.urlencoded({
        extended: true,
    })
);

// Upload folder
const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

app.use(
    "/uploads",
    express.static(uploadPath)
);

// API Routes
app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/products",
    productRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);

// Test backend
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "NearShop Backend is running successfully",
    });
});

// API test
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "NearShop API is working",
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found",
        path: req.originalUrl,
    });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `NearShop server running on port ${PORT}`
    );
});