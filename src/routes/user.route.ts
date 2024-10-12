// routes/user.routes.ts
import express from "express";
import { registerUser, loginUser, changeUserPassword, updateUserProfile, logoutUser } from "../controller/user.controller";
import { protect } from "../middlewares/auth"; // Import the protect middleware

const userRoutes = express.Router();

// Public routes
userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.post("/logout", logoutUser);

// Protected routes
userRoutes.put("/profile", protect, updateUserProfile); // Protecting this route
userRoutes.put("/change-password", protect, changeUserPassword); // Protecting this route

export default userRoutes;
