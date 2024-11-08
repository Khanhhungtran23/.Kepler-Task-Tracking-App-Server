import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { createJWT } from "../utils/util";
import mongoose from "mongoose";


// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { user_name, role, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Create a new user
    const user = await User.create({
      user_name,
      role,
      email,
      password, // Password will be hashed automatically by mongoose pre-save hook
    });

    if (user) {
      // Create a JWT token
      createJWT(res, (user._id as mongoose.Types.ObjectId).toString());
      res.status(201).json({
        _id: user._id,
        user_name: user.user_name,
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

    // Log the email for debugging purposes
    console.log("Email received:", email);

    // Find the user by email with a case-insensitive query
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

    // Check if the user exists
    if (!user || !(await user.matchPassword(password))) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    // Check if the user is active
    else if (user.isActive === false) {
      res.status(403).json({ message: "Your account is disabled. Please contact your manager." });
    }
    // Check if the user exists and the password matches
    else if (user && (await user.matchPassword(password))) {
      // Use the createJWT function from util.ts to generate a JWT and set it in a cookie
      const token = createJWT(res, (user._id as mongoose.Types.ObjectId).toString());
      console.log("Successfully Login");
      console.log("Token provided:", token);
      // Respond with user data, no need to manually return the token as it's in the cookie
      res.json({
        _id: user._id,
        user_name: user.user_name,
        // full_name: user.full_name,
        role: user.role,
        email: user.email,
        isAdmin: user.isAdmin,
        isActive: user.isActive
        // The token will be stored in the cookie, not returned directly in the response
      });
      
    } 
    else {
      // Return a 401 Unauthorized response if the email or password is incorrect
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    // Return a 500 error if something goes wrong on the server
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Change user password
export const changeUserPassword = async (req: Request|any, res: Response): Promise<void> => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user?._id; // Assuming protect middleware is used and user ID is available in req.user

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
      secure: process.env.NODE_ENV === "development", // later in production
      sameSite: "strict", // Prevent CSRF attacks
      expires: new Date(0), // Set expiration time to the past
    });
    res.status(200).json({ message: "User logged out successfully." });
  };
// Update user profile
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user; // Assuming protect middleware is used and user ID is available in req.user
  const { user_name, role } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (user) {
      // Update user profile details
      user.user_name = user_name || user.user_name;
      // user.full_name = full_name || user.full_name;
      user.role = role || user.role;

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        user_name: updatedUser.user_name,
        // full_name: updatedUser.full_name,
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
// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Retrieve all users from the database
    const users = await User.find({}).sort({ createdAt: -1 });
    console.log('Fetched messages:', users);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a user by name
export const getUserByName = async (req: Request, res: Response): Promise<void> => {
  const { user_name } = req.params; // Assuming name is passed as a route parameter

  try {
    // Find users matching the provided name (case insensitive)
    const users = await User.find({ name: { $regex: new RegExp(user_name, "i") } }); // Use regex for case-insensitive search

    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "No users found with that name" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//Disable user account
export const disableUserAccount = async (req: Request|any, res: Response): Promise<void> => {
  const { email } = req.params;

  try {
    const disableUser = await User.findOne({ email });

    //Verify if the disable user is not exists
    if (!disableUser) {
      res.status(404).json({ message: "Disabled user not found" });
      return;
    }

    // Verify if this account is already disabled
    if (!disableUser.isActive) {
      res.status(400).json({ message: "This account is already disabled" });
      return;
    }
    
    disableUser.isActive = false;
    
    await User.findOneAndUpdate(
      { email },
      { isActive: false },
      { new: true, runValidators: true }
    );

    console.log("isActive :", disableUser.isActive);
    res.status(200).json({ message: `Account of ${disableUser.email} has been disabled successfully.`, User : disableUser });
  }catch (err) {
    console.error("Error disabling account:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//Enable user account
export const enableUserAccount = async (req: Request|any, res: Response): Promise<void> => {
  const { email } = req.params;

  try {
    const enableUser = await User.findOne({ email });

    //Verify if the enabled user is not exists
    if (!enableUser) {
      res.status(404).json({ message: "Enabled user not found" });
      return;
    }

    // Verify if this account is already enabled
    if (enableUser.isActive) {
      res.status(400).json({ message: "This account is already enabled" });
      return;
    }
    
    enableUser.isActive = true;
    
    await User.findOneAndUpdate(
      { email },
      { isActive: true },
      { new: true, runValidators: true }
    );

    console.log("isActive :", enableUser.isActive);
    res.status(200).json({ message: `Account of ${enableUser.email} has been enabled successfully.`, User : enableUser  });
  }catch (err) {
    console.error("Error enabling account:", err);
    res.status(500).json({ message: "Server error" });
  }
};