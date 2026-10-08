const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    userName: {
        type: String,
        required: true,
        trim: true,
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },

    comment: {
        type: String,
        default: "",
        trim: true,
        maxlength: 500,
    },
}, {
    timestamps: true,
});

const productSchema = new mongoose.Schema({
    /* =========================
       BASIC PRODUCT INFORMATION
    ========================= */

    name: {
        type: String,
        required: true,
        trim: true,
    },

    category: {
        type: String,
        required: true,
        trim: true,
    },

    subCategory: {
        type: String,
        default: "",
        trim: true,
    },

    brand: {
        type: String,
        default: "",
        trim: true,
    },

    description: {
        type: String,
        default: "",
        trim: true,
    },

    /* =========================
       PRICE
    ========================= */

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    oldPrice: {
        type: Number,
        default: null,
        min: 0,
    },

    discountPercent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },

    /* =========================
       PRODUCT UNIT
    ========================= */

    unit: {
        type: String,
        required: true,
        trim: true,
    },

    weight: {
        type: Number,
        default: null,
    },

    weightUnit: {
        type: String,
        default: "",
        trim: true,
    },

    /* =========================
       SHOP INFORMATION
    ========================= */

    shop: {
        type: String,
        required: true,
        trim: true,
    },

    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },

    shopLocation: {
        type: String,
        default: "",
        trim: true,
    },

    /* =========================
       IMAGES
    ========================= */

    image: {
        type: String,
        required: true,
    },

    images: {
        type: [String],
        default: [],
    },

    /* =========================
       STOCK
    ========================= */

    stock: {
        type: Number,
        default: 0,
        min: 0,
    },

    lowStockLimit: {
        type: Number,
        default: 5,
        min: 0,
    },

    isAvailable: {
        type: Boolean,
        default: true,
    },

    /* =========================
       RATINGS
    ========================= */

    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },

    ratingCount: {
        type: Number,
        default: 0,
        min: 0,
    },

    reviews: {
        type: [reviewSchema],
        default: [],
    },

    /* =========================
       LIKES / WISHLIST
    ========================= */

    likes: {
        type: Number,
        default: 0,
        min: 0,
    },

    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }, ],

    /* =========================
       PRODUCT OFFER
    ========================= */

    isOffer: {
        type: Boolean,
        default: false,
    },

    offerTitle: {
        type: String,
        default: "",
        trim: true,
    },

    offerDescription: {
        type: String,
        default: "",
        trim: true,
    },

    offerStartDate: {
        type: Date,
        default: null,
    },

    offerEndDate: {
        type: Date,
        default: null,
    },

    /* =========================
       COUPON ELIGIBILITY
    ========================= */

    couponEligible: {
        type: Boolean,
        default: true,
    },

    /* =========================
       EXTRA PRODUCT INFORMATION
    ========================= */

    tags: {
        type: [String],
        default: [],
    },

    isFeatured: {
        type: Boolean,
        default: false,
    },

    isPopular: {
        type: Boolean,
        default: false,
    },

    isNewArrival: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

/* =========================
   AUTOMATIC AVAILABILITY
========================= */

productSchema.pre("save", function(next) {
    this.isAvailable = this.stock > 0;
    next();
});

/* =========================
   AUTOMATIC RATING
========================= */

productSchema.methods.updateRating = function() {
    if (!this.reviews || this.reviews.length === 0) {
        this.rating = 0;
        this.ratingCount = 0;
        return;
    }

    const totalRating = this.reviews.reduce(
        (total, review) =>
        total + Number(review.rating),
        0
    );

    this.rating = Number(
        (totalRating / this.reviews.length).toFixed(1)
    );

    this.ratingCount = this.reviews.length;
};

module.exports = mongoose.model(
    "Product",
    productSchema
);