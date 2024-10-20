import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import mongoose from "mongoose";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies?.token;

  // Check if the authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract the token from the authorization header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };

      // Find the user by the decoded token ID and exclude the password field
      const user = await User.findById(decoded._id).select("-password");

      // If user is not found, return a 404 error
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return; // Stop further execution
      }

      // Attach the user ID and admin status to the request object
      req.user = { _id: user._id as mongoose.Types.ObjectId, isAdmin: user.isAdmin };

      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      // Log the error for debugging
      console.error("Token verification failed:", error);

      // Pass the error to the next middleware or route handler
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    // If no token is provided, log the error and return a 401 error
    console.error("No token provided");
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
// Extend the Express Request interface to include `user`

// Middleware to check if the user is an admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    // Proceed to the next middleware if the user is an admin
    next();
  } else {
    // If not admin, return 401 Unauthorized with a custom message
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};
