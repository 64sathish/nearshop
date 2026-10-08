const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

// ==========================================
// TEMPORARY OTP STORAGE
// ==========================================
// Development purpose only.
// Later we can connect SMS/email OTP service.
const otpStore = new Map();

// ==========================================
// GENERATE 6 DIGIT OTP
// ==========================================
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==========================================
// REGISTER
// POST /api/users/register
// ==========================================
router.post("/register", async(req, res) => {
    try {
        console.log("================================");
        console.log("REGISTER REQUEST:", req.body);
        console.log("================================");

        const {
            name,
            email,
            phone,
            password,
            role,
        } = req.body;

        // -------------------------------
        // Required fields
        // -------------------------------
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }

        // -------------------------------
        // Clean values
        // -------------------------------
        const cleanName = String(name).trim();

        const cleanEmail = String(email)
            .trim()
            .toLowerCase();

        const cleanPhone = String(phone).trim();

        const cleanPassword = String(password);

        // -------------------------------
        // Name validation
        // -------------------------------
        if (cleanName.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Name must contain at least 2 characters.",
            });
        }

        // -------------------------------
        // Email validation
        // -------------------------------
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address.",
            });
        }

        // -------------------------------
        // Phone validation
        // -------------------------------
        if (!/^[0-9]{10}$/.test(cleanPhone)) {
            return res.status(400).json({
                success: false,
                message: "Phone number must contain exactly 10 digits.",
            });
        }

        // -------------------------------
        // Password validation
        // -------------------------------
        if (cleanPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters.",
            });
        }

        if (!/[A-Z]/.test(cleanPassword)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least one uppercase letter.",
            });
        }

        if (!/[a-z]/.test(cleanPassword)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least one lowercase letter.",
            });
        }

        if (!/[0-9]/.test(cleanPassword)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least one number.",
            });
        }

        if (!/[!@#$%^&*(),.?":{}|<>_\-]/.test(
                cleanPassword
            )) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least one special character.",
            });
        }

        // -------------------------------
        // Check existing email
        // -------------------------------
        const existingUser = await User.findOne({
            email: cleanEmail,
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "An account already exists with this email.",
            });
        }

        // -------------------------------
        // Check existing phone
        // -------------------------------
        const existingPhone = await User.findOne({
            phone: cleanPhone,
        });

        if (existingPhone) {
            return res.status(400).json({
                success: false,
                message: "An account already exists with this phone number.",
            });
        }

        // -------------------------------
        // Hash password
        // -------------------------------
        const hashedPassword = await bcrypt.hash(
            cleanPassword,
            10
        );

        // -------------------------------
        // User role
        // -------------------------------
        const userRole =
            role === "shop" ? "shop" : "customer";

        // -------------------------------
        // Create user
        // -------------------------------
        const user = await User.create({
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            password: hashedPassword,
            role: userRole,
        });

        console.log(
            "USER CREATED SUCCESSFULLY:",
            user.email
        );

        return res.status(201).json({
            success: true,
            message: "Registration successful.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("================================");
        console.error("REGISTER ERROR:", error.message);
        console.error("================================");

        return res.status(500).json({
            success: false,
            message: "Registration failed.",
            error: error.message,
        });
    }
});

// ==========================================
// LOGIN
// POST /api/users/login
// ==========================================
router.post("/login", async(req, res) => {
    try {
        console.log("LOGIN REQUEST:", req.body.email);

        const {
            email,
            password,
        } = req.body;

        // -------------------------------
        // Required fields
        // -------------------------------
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        // -------------------------------
        // Clean email
        // -------------------------------
        const cleanEmail = String(email)
            .trim()
            .toLowerCase();

        // -------------------------------
        // Find user
        // -------------------------------
        const user = await User.findOne({
            email: cleanEmail,
        });

        if (!user) {
            console.log(
                "LOGIN FAILED: USER NOT FOUND"
            );

            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // -------------------------------
        // Compare password
        // -------------------------------
        const passwordMatch =
            await bcrypt.compare(
                String(password),
                user.password
            );

        if (!passwordMatch) {
            console.log(
                "LOGIN FAILED: WRONG PASSWORD"
            );

            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // -------------------------------
        // Generate OTP
        // -------------------------------
        const otp = generateOTP();

        const expiresAt =
            Date.now() + 5 * 60 * 1000;

        otpStore.set(cleanEmail, {
            otp,
            expiresAt,
            userId: user._id.toString(),
        });

        // -------------------------------
        // Development OTP
        // -------------------------------
        console.log("================================");
        console.log(
            `NearShop OTP for ${cleanEmail}: ${otp}`
        );
        console.log(
            "OTP expires in 5 minutes"
        );
        console.log("================================");

        return res.json({
            success: true,
            requiresOTP: true,
            message: "OTP generated successfully.",
            email: cleanEmail,

            // Development only
            developmentOTP: otp,
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed.",
        });
    }
});

// ==========================================
// VERIFY OTP
// POST /api/users/verify-otp
// ==========================================
router.post(
    "/verify-otp",
    async(req, res) => {
        try {
            const {
                email,
                otp,
            } = req.body;

            // -------------------------------
            // Required fields
            // -------------------------------
            if (!email || !otp) {
                return res.status(400).json({
                    success: false,
                    message: "Email and OTP are required.",
                });
            }

            const cleanEmail = String(email)
                .trim()
                .toLowerCase();

            const cleanOTP = String(otp)
                .trim();

            // -------------------------------
            // OTP validation
            // -------------------------------
            if (!/^[0-9]{6}$/.test(cleanOTP)) {
                return res.status(400).json({
                    success: false,
                    message: "OTP must contain 6 digits.",
                });
            }

            // -------------------------------
            // Get stored OTP
            // -------------------------------
            const storedOTP =
                otpStore.get(cleanEmail);

            if (!storedOTP) {
                return res.status(400).json({
                    success: false,
                    message: "OTP not found. Please request a new OTP.",
                });
            }

            // -------------------------------
            // Check expiry
            // -------------------------------
            if (
                Date.now() >
                storedOTP.expiresAt
            ) {
                otpStore.delete(cleanEmail);

                return res.status(400).json({
                    success: false,
                    message: "OTP has expired. Please request a new OTP.",
                });
            }

            // -------------------------------
            // Check OTP
            // -------------------------------
            if (
                storedOTP.otp !== cleanOTP
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Incorrect OTP.",
                });
            }

            // -------------------------------
            // Find user
            // -------------------------------
            const user =
                await User.findById(
                    storedOTP.userId
                );

            if (!user) {
                otpStore.delete(cleanEmail);

                return res.status(404).json({
                    success: false,
                    message: "User account not found.",
                });
            }

            // -------------------------------
            // Delete used OTP
            // -------------------------------
            otpStore.delete(cleanEmail);

            // -------------------------------
            // Create JWT
            // -------------------------------
            const token = jwt.sign({
                    id: user._id,
                    role: user.role,
                },
                process.env.JWT_SECRET, {
                    expiresIn: "7d",
                }
            );

            console.log(
                "OTP VERIFIED:",
                user.email
            );

            // -------------------------------
            // Send response
            // -------------------------------
            return res.json({
                success: true,
                message: "OTP verified successfully.",

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
                "VERIFY OTP ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "OTP verification failed.",
            });
        }
    }
);

// ==========================================
// RESEND OTP
// POST /api/users/resend-otp
// ==========================================
router.post(
    "/resend-otp",
    async(req, res) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: "Email is required.",
                });
            }

            const cleanEmail = String(email)
                .trim()
                .toLowerCase();

            // -------------------------------
            // Find user
            // -------------------------------
            const user =
                await User.findOne({
                    email: cleanEmail,
                });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User account not found.",
                });
            }

            // -------------------------------
            // Generate new OTP
            // -------------------------------
            const otp = generateOTP();

            const expiresAt =
                Date.now() + 5 * 60 * 1000;

            otpStore.set(cleanEmail, {
                otp,
                expiresAt,
                userId: user._id.toString(),
            });

            console.log("================================");
            console.log(
                `NEW NearShop OTP for ${cleanEmail}: ${otp}`
            );
            console.log(
                "OTP expires in 5 minutes"
            );
            console.log("================================");

            return res.json({
                success: true,
                message: "New OTP generated successfully.",

                // Development only
                developmentOTP: otp,
            });
        } catch (error) {
            console.error(
                "RESEND OTP ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Unable to resend OTP.",
            });
        }
    }
);

module.exports = router;