const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    category: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    oldPrice: {
        type: Number,
        default: null,
    },

    unit: {
        type: String,
        required: true,
    },

    shop: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        required: true,
    },

    stock: {
        type: Number,
        default: 0,
    },

    description: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Product", productSchema);