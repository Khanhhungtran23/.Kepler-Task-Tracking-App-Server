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
export const createJWT = (res: Response, userId: string): string => {
    // Ensure the JWT secret exists in the environment variables
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT Secret not found in environment variables.");
    }
    try {
    const token = jwt.sign({ _id: userId }, jwtSecret, {
      expiresIn: "1d", // Token expiry set to 1 day
      algorithm: "HS256"
    }) 
    // Set the cookie with the JWT token
  res.cookie("token", token, {
    httpOnly: true, // Secure the cookie
    secure: process.env.NODE_ENV === "production", // Use secure cookies in non-development environments
    sameSite: "none", 
    maxAge: 1 * 24 * 60 * 60 * 1000, // Set expiration time to 1 day (in milliseconds)
  });
  // Return the token so it can also be logged or used elsewhere
  return token;
  } catch(error){
    console.error("Error when create JWT:", error);
    throw new Error("Cannot create JWT!");
  };
};