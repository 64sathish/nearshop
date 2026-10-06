const express = require("express");
const multer = require("multer");
const path = require("path");

const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// Image Upload Configuration
// ===============================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    },
});

const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;

        const extension = allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );

        const mimeType = allowedTypes.test(file.mimetype);

        if (extension && mimeType) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only JPG, JPEG, PNG and WEBP images are allowed"
                )
            );
        }
    },
});

// ===============================
// Get All Products
// ===============================

router.get("/", async(req, res) => {
    try {
        const products = await Product.find().sort({
            createdAt: -1,
        });

        res.json(products);
    } catch (error) {
        console.error("Get products error:", error.message);

        res.status(500).json({
            message: "Server error",
        });
    }
});

// ===============================
// Get One Product
// ===============================

router.get("/:id", async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
});

// ===============================
// Upload Product Image
// ===============================

router.post(
    "/upload-image",
    protect,
    upload.single("image"),
    (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "Please select an image",
                });
            }

            const imageUrl =
                `http://localhost:5000/uploads/` +
                req.file.filename;

            res.json({
                message: "Image uploaded successfully",
                imageUrl,
            });
        } catch (error) {
            console.error(
                "Image upload error:",
                error.message
            );

            res.status(500).json({
                message: "Image upload failed",
            });
        }
    }
);

// ===============================
// Add New Product
// ===============================

router.post("/", protect, async(req, res) => {
    try {
        const {
            name,
            category,
            price,
            oldPrice,
            unit,
            shop,
            image,
            stock,
            description,
        } = req.body;

        if (!name ||
            !category ||
            !price ||
            !unit ||
            !shop ||
            !image
        ) {
            return res.status(400).json({
                message: "Please fill all required fields",
            });
        }

        const product = await Product.create({
            name,
            category,
            price,
            oldPrice,
            unit,
            shop,
            image,
            stock,
            description,
        });

        res.status(201).json({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.error(
            "Create product error:",
            error.message
        );

        res.status(500).json({
            message: "Server error",
        });
    }
});
// ===============================
// Update Product
// ===============================

router.put("/:id", protect, async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body, {
                new: true,
                runValidators: true,
            }
        );

        res.json({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.error("Update product error:", error.message);

        res.status(500).json({
            message: "Server error",
        });
    }
});

// ===============================
// Delete Product
// ===============================

router.delete("/:id", protect, async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Delete product error:", error.message);

        res.status(500).json({
            message: "Server error",
        });
    }
});
module.exports = router;