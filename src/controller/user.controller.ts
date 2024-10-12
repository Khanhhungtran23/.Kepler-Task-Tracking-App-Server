import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { createJWT } from "../utils/util";
import mongoose from "mongoose";

// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, title, role, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Create a new user
    const user = await User.create({
      name,
      title,
      role,
      email,
      password, // Password will be hashed automatically by mongoose pre-save hook
    });

    if (user) {
      // Create a JWT token
      createJWT(res, (user._id as mongoose.Types.ObjectId).toString());
      res.status(201).json({
        _id: user._id,
        name: user.name,
        title: user.title,
        role: user.role,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // If the user exists and password matches, create a JWT token
      createJWT(res, (user._id as mongoose.Types.ObjectId).toString());

      res.json({
        _id: user._id,
        name: user.name,
        title: user.title,
        role: user.role,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Change user password
export const changeUserPassword = async (req: Request, res: Response): Promise<void> => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user; // Assuming protect middleware is used and user ID is available in req.user

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (user && (await user.matchPassword(oldPassword))) {
      // If old password matches, hash the new password and save it
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(400).json({ message: "Old password is incorrect" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// Logout user
export const logoutUser = (req: Request, res: Response) => {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF attacks
      expires: new Date(0), // Set expiration time to the past
    });
    res.status(200).json({ message: "User logged out successfully." });
  };
// Update user profile
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user; // Assuming protect middleware is used and user ID is available in req.user
  const { name, title, role } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (user) {
      // Update user profile details
      user.name = name || user.name;
      user.title = title || user.title;
      user.role = role || user.role;

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        title: updatedUser.title,
        role: updatedUser.role,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
