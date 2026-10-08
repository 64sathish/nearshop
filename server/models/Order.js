const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
        min: 1,
    },

    unit: {
        type: String,
        default: "",
    },

    shop: {
        type: String,
        default: "",
    },

    image: {
        type: String,
        default: "",
    },
}, {
    _id: false,
});

const orderSchema = new mongoose.Schema({
        orderId: {
            type: String,
            required: true,
            unique: true,
        },

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },

        customerName: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
        },

        address: {
            name: String,
            phone: String,
            address: String,
            city: String,
            pincode: String,
        },

        items: {
            type: [orderItemSchema],
            required: true,
        },

        subtotal: {
            type: Number,
            required: true,
        },

        // Purchase based discount
        discountPercent: {
            type: Number,
            default: 0,
        },

        discountAmount: {
            type: Number,
            default: 0,
        },

        deliveryCharge: {
            type: Number,
            default: 0,
        },

        total: {
            type: Number,
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["cod", "upi"],
            default: "cod",
        },

        status: {
            type: String,
            enum: [
                "Order Placed",
                "Shop Confirmed",
                "Preparing",
                "Out for Delivery",
                "Delivered",
                "Cancelled",
            ],
            default: "Order Placed",
        },
    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);