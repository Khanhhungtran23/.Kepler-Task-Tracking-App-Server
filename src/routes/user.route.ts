// routes/user.routes.ts
import express from "express";
import { registerUser, loginUser, changeUserPassword, updateUserProfile, logoutUser, getAllUsers, getUserByName } from "../controller/user.controller";
import { protect } from "../middlewares/auth"; // Import the protect middleware

const userRoutes = express.Router();

// Public routes
userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.post("/logout", logoutUser);

// Protected routes
userRoutes.put("/profile",  updateUserProfile); // Protecting this route
userRoutes.put("/change-password",  changeUserPassword); // Protecting this route

userRoutes.get("/get-all-info",  getAllUsers) // Get information from user routes
userRoutes.get("/search/:name",  getUserByName); // Route to search users by name

export default userRoutes;
