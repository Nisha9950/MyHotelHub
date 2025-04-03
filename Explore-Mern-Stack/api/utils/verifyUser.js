import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';



export const verifyToken = (req, res, next) =>{
    const token = req.cookies.access_token || req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Access Denied. No token provided!" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // ✅ Store user info in request
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid token!" });
    }
};