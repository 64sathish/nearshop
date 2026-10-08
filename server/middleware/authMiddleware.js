const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                message: "Not authorized. Please login.",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};


// ==========================================
// ADMIN ONLY
// ==========================================

const adminOnly = (req, res, next) => {
    if (!req.user ||
        req.user.role !== "admin"
    ) {
        return res.status(403).json({
            message: "Admin access required.",
        });
    }

    next();
};


// ==========================================
// SHOP ONLY
// ==========================================

const shopOnly = (req, res, next) => {
    if (!req.user ||
        req.user.role !== "shop"
    ) {
        return res.status(403).json({
            message: "Shop access required.",
        });
    }

    next();
};


// ==========================================
// ADMIN OR SHOP
// ==========================================

const adminOrShop = (req, res, next) => {
    if (!req.user ||
        !["admin", "shop"].includes(
            req.user.role
        )
    ) {
        return res.status(403).json({
            message: "Admin or Shop access required.",
        });
    }

    next();
};


module.exports = {
    protect,
    adminOnly,
    shopOnly,
    adminOrShop,
};