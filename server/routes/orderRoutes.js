const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


// ========================================
// REGISTER
// POST /api/users/register
// ========================================

router.post("/register", async(req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            role,
        } = req.body;

        if (!name ||
            !email ||
            !phone ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
        }

        const existingUser =
            await User.findOne({
                email: email.toLowerCase(),
            });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,

            role: role === "shop" ?
                "shop" :
                "customer",
        });

        const token = jwt.sign({
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET, {
                expiresIn: "7d",
            }
        );

        res.status(201).json({
            success: true,

            message: "Registration successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });

    } catch (error) {

        console.error(
            "Register error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Registration failed",
        });
    }
});


// ========================================
// LOGIN
// POST /api/users/login
// ========================================

router.post("/login", async(req, res) => {
    try {

        const {
            email,
            password,
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user =
            await User.findOne({
                email: email.toLowerCase(),
            });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // IMPORTANT:
        // Role is included in JWT
        const token = jwt.sign({
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET, {
                expiresIn: "7d",
            }
        );

        res.json({
            success: true,

            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });

    } catch (error) {

        console.error(
            "Login error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
});


module.exports = router;