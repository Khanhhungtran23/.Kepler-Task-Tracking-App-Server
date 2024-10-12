import mongoose from "mongoose";
import { Response } from "express";
import jwt from "jsonwebtoken";


// DB connection with TypeScript
export const dbConnection = async (): Promise<void> => {
    try {
      // Ensure the MongoDB URI exists in the environment variables
      const mongoURI = process.env.MONGODB_URI;
      if (!mongoURI) {
        throw new Error("MongoDB URI not found in environment variables.");
      }
  
      await mongoose.connect(mongoURI);
      console.log("DB connection established succesfully!");
    } catch (error) {
      console.log("DB Error: " + error);
    }
  };

  // JWT creation with TypeScript
export const createJWT = (res: Response, userId: string): void => {
    // Ensure the JWT secret exists in the environment variables
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT Secret not found in environment variables.");
    }
  
    const token = jwt.sign({ userId }, jwtSecret, {
      expiresIn: "1d", // Token expiry set to 1 day
    }) 
    // Set the cookie with the JWT token
  res.cookie("token", token, {
    httpOnly: true, // Secure the cookie
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in non-development environments
    sameSite: "strict", // Prevent CSRF attack
    maxAge: 1 * 24 * 60 * 60 * 1000, // Set expiration time to 1 day (in milliseconds)
  });
};