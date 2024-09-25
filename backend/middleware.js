import JWT_SECRET from "./config.js";
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if the authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "No token provided or token is invalid." });
    }

    // Extract the token from the header
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach userId to the request object
        if (decoded.userId) {
            req.userId = decoded.userId;
        } else {
            return res.status(403).json({ message: "Token does not contain user ID." });
        }

        next(); // Call the next middleware
    } catch (err) {
        // Log the error for debugging
        console.error("Token verification error:", err);

        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({
                message: "Token has expired. Please log in again."
            });
        }

        return res.status(403).json({
            message: "Failed to authenticate token."
        });
    }
};

export default authMiddleware;
