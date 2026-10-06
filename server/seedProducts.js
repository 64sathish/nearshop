const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const products = [{
        name: "Fresh Tomato",
        category: "Vegetables",
        price: 40,
        oldPrice: 50,
        unit: "1 kg",
        shop: "Sri Murugan Stores",
        image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500",
        stock: 50,
        description: "Fresh red tomatoes.",
    },
    {
        name: "Fresh Potato",
        category: "Vegetables",
        price: 45,
        oldPrice: 55,
        unit: "1 kg",
        shop: "Sri Murugan Stores",
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500",
        stock: 50,
        description: "Fresh potatoes.",
    },
    {
        name: "Fresh Carrot",
        category: "Vegetables",
        price: 60,
        oldPrice: 70,
        unit: "1 kg",
        shop: "Green Fresh Mart",
        image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=500",
        stock: 40,
        description: "Fresh carrots.",
    },
    {
        name: "Fresh Banana",
        category: "Fruits",
        price: 60,
        oldPrice: 75,
        unit: "1 dozen",
        shop: "Green Fresh Mart",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500",
        stock: 30,
        description: "Fresh bananas.",
    },
    {
        name: "Fresh Apple",
        category: "Fruits",
        price: 140,
        oldPrice: 170,
        unit: "1 kg",
        shop: "City Fruits Shop",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500",
        stock: 30,
        description: "Fresh apples.",
    },
    {
        name: "Orange",
        category: "Fruits",
        price: 100,
        oldPrice: 120,
        unit: "1 kg",
        shop: "City Fruits Shop",
        image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=500",
        stock: 35,
        description: "Fresh oranges.",
    },
    {
        name: "Fresh Milk",
        category: "Dairy",
        price: 55,
        oldPrice: 65,
        unit: "1 litre",
        shop: "A2B Daily Needs",
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500",
        stock: 40,
        description: "Fresh dairy milk.",
    },
    {
        name: "Curd",
        category: "Dairy",
        price: 40,
        oldPrice: 45,
        unit: "500 g",
        shop: "A2B Daily Needs",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500",
        stock: 40,
        description: "Fresh curd.",
    },
    {
        name: "Basmati Rice",
        category: "Rice & Grains",
        price: 180,
        oldPrice: 220,
        unit: "1 kg",
        shop: "Annai Grocery",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500",
        stock: 100,
        description: "Premium basmati rice.",
    },
    {
        name: "Wheat Flour",
        category: "Rice & Grains",
        price: 60,
        oldPrice: 75,
        unit: "1 kg",
        shop: "Annai Grocery",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500",
        stock: 60,
        description: "Fresh wheat flour.",
    },
    {
        name: "Bread",
        category: "Bakery",
        price: 40,
        oldPrice: 45,
        unit: "400 g",
        shop: "Fresh Bake Shop",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500",
        stock: 30,
        description: "Fresh bakery bread.",
    },
    {
        name: "Chocolate Cake",
        category: "Bakery",
        price: 350,
        oldPrice: 400,
        unit: "1 kg",
        shop: "Fresh Bake Shop",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
        stock: 10,
        description: "Delicious chocolate cake.",
    },
    {
        name: "Fruit Juice",
        category: "Beverages",
        price: 90,
        oldPrice: 110,
        unit: "1 litre",
        shop: "Daily Needs Store",
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500",
        stock: 30,
        description: "Fresh fruit juice.",
    },
    {
        name: "Cold Drink",
        category: "Beverages",
        price: 45,
        oldPrice: 50,
        unit: "750 ml",
        shop: "Daily Needs Store",
        image: "https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?w=500",
        stock: 40,
        description: "Refreshing cold drink.",
    },
];

const seedProducts = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await Product.deleteMany();

        await Product.insertMany(products);

        console.log(`${products.length} products inserted successfully`);

        await mongoose.connection.close();

        process.exit(0);
    } catch (error) {
        console.error("Seed error:", error.message);

        process.exit(1);
    }
};

seedProducts();