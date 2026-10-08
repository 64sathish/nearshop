const express = require("express");
const mongoose = require("mongoose");

const Product = require("../models/Product");
const {
    protect,
    adminOrShop,
} = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================================================
   GET ALL PRODUCTS
   Supports:
   search
   category
   shop
   minPrice
   maxPrice
   minRating
   maxRating
   sort
========================================================= */

router.get("/", async(req, res) => {
    try {
        const {
            search,
            category,
            shop,
            minPrice,
            maxPrice,
            minRating,
            maxRating,
            sort,
        } = req.query;

        const filter = {};

        // Search by product name, brand or category
        if (search) {
            filter.$or = [{
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    brand: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    category: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        // Category filter
        if (category && category !== "all") {
            filter.category = {
                $regex: `^${category}$`,
                $options: "i",
            };
        }

        // Shop filter
        if (shop && shop !== "all") {
            filter.shop = {
                $regex: `^${shop}$`,
                $options: "i",
            };
        }

        // Price filter
        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        // Rating filter
        if (minRating || maxRating) {
            filter.rating = {};

            if (minRating) {
                filter.rating.$gte = Number(minRating);
            }

            if (maxRating) {
                filter.rating.$lte = Number(maxRating);
            }
        }

        let query = Product.find(filter);

        // Sorting
        if (sort === "price-low") {
            query = query.sort({ price: 1 });
        } else if (sort === "price-high") {
            query = query.sort({ price: -1 });
        } else if (sort === "rating-high") {
            query = query.sort({ rating: -1 });
        } else if (sort === "rating-low") {
            query = query.sort({ rating: 1 });
        } else if (sort === "likes-high") {
            query = query.sort({ likes: -1 });
        } else if (sort === "newest") {
            query = query.sort({ createdAt: -1 });
        } else {
            query = query.sort({ createdAt: -1 });
        }

        const products = await query;

        res.json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        console.error("GET PRODUCTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load products",
            error: error.message,
        });
    }
});


/* =========================================================
   GET SINGLE PRODUCT
========================================================= */

router.get("/:id", async(req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.json({
            success: true,
            product,
        });
    } catch (error) {
        console.error("GET PRODUCT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load product",
            error: error.message,
        });
    }
});


/* =========================================================
   LIKE / UNLIKE PRODUCT
========================================================= */

router.post("/:id/like", protect, async(req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const userId = req.user.id || req.user._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User ID not found",
            });
        }

        const alreadyLiked = product.likedBy.some(
            (likedUserId) =>
            likedUserId.toString() === userId.toString()
        );

        if (alreadyLiked) {
            // UNLIKE
            product.likedBy = product.likedBy.filter(
                (likedUserId) =>
                likedUserId.toString() !== userId.toString()
            );

            product.likes = product.likedBy.length;

            await product.save();

            return res.json({
                success: true,
                liked: false,
                likes: product.likes,
                message: "Product unliked",
            });
        }

        // LIKE
        product.likedBy.push(userId);
        product.likes = product.likedBy.length;

        await product.save();

        res.json({
            success: true,
            liked: true,
            likes: product.likes,
            message: "Product liked",
        });
    } catch (error) {
        console.error("LIKE PRODUCT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to like product",
            error: error.message,
        });
    }
});


/* =========================================================
   ADD RATING + REVIEW
========================================================= */

router.post("/:id/reviews", protect, async(req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        const numericRating = Number(rating);

        if (!numericRating ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5",
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const userId = req.user.id || req.user._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User ID not found",
            });
        }

        // Prevent same user from reviewing same product twice
        const existingReview = product.reviews.find(
            (review) =>
            review.userId.toString() === userId.toString()
        );

        if (existingReview) {
            existingReview.rating = numericRating;
            existingReview.comment = comment || "";
        } else {
            product.reviews.push({
                userId,
                userName: req.user.name || "Customer",
                rating: numericRating,
                comment: comment || "",
            });
        }

        product.updateRating();

        await product.save();

        res.json({
            success: true,
            message: "Rating and review saved successfully",
            rating: product.rating,
            ratingCount: product.ratingCount,
            reviews: product.reviews,
        });
    } catch (error) {
        console.error("REVIEW ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to save review",
            error: error.message,
        });
    }
});


/* =========================================================
   DELETE OWN REVIEW
========================================================= */

router.delete("/:id/reviews", protect, async(req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const userId = req.user.id || req.user._id;

        const oldLength = product.reviews.length;

        product.reviews = product.reviews.filter(
            (review) =>
            review.userId.toString() !== userId.toString()
        );

        if (product.reviews.length === oldLength) {
            return res.status(404).json({
                success: false,
                message: "Your review was not found",
            });
        }

        product.updateRating();

        await product.save();

        res.json({
            success: true,
            message: "Review deleted successfully",
            rating: product.rating,
            ratingCount: product.ratingCount,
            reviews: product.reviews,
        });
    } catch (error) {
        console.error("DELETE REVIEW ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete review",
            error: error.message,
        });
    }
});


/* =========================================================
   CREATE PRODUCT
   Admin / Shop
========================================================= */

router.post("/", protect, adminOrShop, async(req, res) => {
    try {
        const {
            name,
            category,
            subCategory,
            brand,
            description,
            price,
            oldPrice,
            discountPercent,
            unit,
            weight,
            weightUnit,
            shop,
            shopId,
            shopLocation,
            image,
            images,
            stock,
            lowStockLimit,
            isOffer,
            offerTitle,
            offerDescription,
            offerStartDate,
            offerEndDate,
            couponEligible,
            tags,
            isFeatured,
            isPopular,
            isNewArrival,
        } = req.body;

        if (!name ||
            !category ||
            price === undefined ||
            !unit ||
            !shop ||
            !image
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, category, price, unit, shop and image are required",
            });
        }

        const product = await Product.create({
            name,
            category,
            subCategory: subCategory || "",
            brand: brand || "",
            description: description || "",
            price: Number(price),
            oldPrice: oldPrice !== undefined &&
                oldPrice !== null &&
                oldPrice !== "" ?
                Number(oldPrice) :
                null,
            discountPercent: Number(discountPercent || 0),
            unit,
            weight: weight !== undefined &&
                weight !== null &&
                weight !== "" ?
                Number(weight) :
                null,
            weightUnit: weightUnit || "",
            shop,
            shopId: shopId ||
                (req.user.role === "shop" ? req.user.id : null),
            shopLocation: shopLocation || "",
            image,
            images: Array.isArray(images) ? images : [],
            stock: Number(stock || 0),
            lowStockLimit: Number(lowStockLimit || 5),
            isOffer: Boolean(isOffer),
            offerTitle: offerTitle || "",
            offerDescription: offerDescription || "",
            offerStartDate: offerStartDate || null,
            offerEndDate: offerEndDate || null,
            couponEligible: couponEligible === undefined ?
                true :
                Boolean(couponEligible),
            tags: Array.isArray(tags) ? tags : [],
            isFeatured: Boolean(isFeatured),
            isPopular: Boolean(isPopular),
            isNewArrival: Boolean(isNewArrival),
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.error("CREATE PRODUCT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create product",
            error: error.message,
        });
    }
});


/* =========================================================
   UPDATE PRODUCT
   Admin / Shop
========================================================= */

router.put("/:id", protect, adminOrShop, async(req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        Object.keys(req.body).forEach((key) => {
            if (
                key !== "likes" &&
                key !== "likedBy" &&
                key !== "reviews" &&
                key !== "rating" &&
                key !== "ratingCount"
            ) {
                product[key] = req.body[key];
            }
        });

        await product.save();

        res.json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        console.error("UPDATE PRODUCT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update product",
            error: error.message,
        });
    }
});


/* =========================================================
   DELETE PRODUCT
   Admin / Shop
========================================================= */

router.delete("/:id", protect, adminOrShop, async(req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        await Product.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("DELETE PRODUCT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete product",
            error: error.message,
        });
    }
});


module.exports = router;