import { Request, Response } from "express";
import User from "../models/user.model";
import { createJWT } from "../utils/util";
import mongoose from "mongoose";
import redisClient from "../utils/redis";
import clearUserCache from "../helpers/clearUserCache";

// Register a new user
export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { user_name, role, email, password } = req.body.body || req.body;

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
      // createJWT(res, (user._id as mongoose.Types.ObjectId).toString());
      await clearUserCache();
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
    console.error("Error during user registration:", err);
    if (err instanceof Error) {
      res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    } else {
      res.status(500).json({ message: "Server error", error: "Unknown error" });
    }
  }
};

// Login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body.body || req.body;

  try {
    // Log the email for debugging purposes
    console.log("Email received:", email);

    // Find the user by email with a case-insensitive query
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });

    // Check if the user exists
    if (!user || !(await user.matchPassword(password))) {
      res.status(401).json({
        message: "Invalid email or password, email and password are required!",
      });
      return;
    }
    // Check if the user is active
    if (user.isActive === false) {
      res.status(403).json({
        message: "Your account is disabled. Please contact your manager.",
      });
    }
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    // Check if the user exists and the password matches
    if (user && (await user.matchPassword(password))) {
      // Use the createJWT function from util.ts to generate a JWT and set it in a cookie
      const token = createJWT(
        res,
        (user._id as mongoose.Types.ObjectId).toString(),
        user.isAdmin,
      );
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
        isActive: user.isActive,
      });
    } else {
      // Return a 401 Unauthorized response if the email or password is incorrect
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    // Return a 500 error if something goes wrong on the server
    console.error("Error during login:", err);
    if (err instanceof Error) {
      res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    } else {
      res.status(500).json({ message: "Server error", error: "Unknown error" });
    }
  }
};

// Change user password
export const changeUserPassword = async (
  req: Request | any,
  res: Response,
): Promise<void> => {
  const { oldPassword, newPassword } = req.body.body || req.body;
  const userId = req.user?._id; // protect middleware is used and user ID is available in req.user

  console.log("Request body:", req.body.body || req.body);
  console.log("User ID:", userId);

  if (!oldPassword || !newPassword) {
    console.log("Password fields are missing");
    res.status(400).json({ message: "Old and new passwords are required" });
    return;
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      res.status(404).json({ message: "User not found" });
      return;
    } else {
      console.log("User found:", user);
    }

    if (user && (await user.matchPassword(oldPassword))) {
      // If old password matches, hash the new password and save it
      console.log("Old password is correct, updating password...");
      user.password = newPassword;
      await user.save();
      res.status(200).json({ message: "Password updated successfully" });
      return;
    } else {
      console.log("Old password is incorrect");
      res.status(400).json({ message: "Old password is incorrect" });
      return;
    }
  } catch (err) {
    console.error("Error in changeUserPassword:", err);
    if (err instanceof Error) {
      res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    } else {
      res.status(500).json({ message: "Server error", error: "Unknown error" });
    }
  }
};
// Logout user
export const logoutUser = (req: Request, res: Response) => {
  // Log cookie trước khi thực hiện xóa
  console.log("Cookies before logout:", req.cookies);

  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0),
    path: "/",
  });

  // Log cookie sau khi thực hiện xóa
  console.log("Cookies after logout cleared.");

  // Phản hồi lại cho client
  res.status(200).json({ message: "User logged out successfully." });
};
// Update user profile for only user or admin
export const updateUserProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user; // Assuming protect middleware is used and user ID is available in req.user
  const { user_name, role } = req.body.body || req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (user) {
      // Update user profile details
      user.user_name = user_name || user.user_name;
      // user.full_name = full_name || user.full_name;
      user.role = role || user.role;

      const updatedUser = await user.save();
      await clearUserCache();

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
    console.error("Error in update user profile:", err);
    if (err instanceof Error) {
      res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    } else {
      res.status(500).json({ message: "Server error", error: "Unknown error" });
    }
  }
};

// Function to update user profile by admin (edit member info in team)
export const adminUpdateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { user_name, role, isAdmin } = req.body.body || req.body;
  const userEmail = req.params.email;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user_name !== undefined) user.user_name = user_name;
    if (role !== undefined) user.role = role;
    if (isAdmin !== undefined) user.isAdmin = isAdmin;

    const updatedUser = await user.save();
    await clearUserCache();

    res.status(200).json({
      message: "User updated successfully!",
      user: {
        _id: updatedUser._id,
        user_name: updatedUser.user_name,
        role: updatedUser.role,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isActive: updatedUser.isActive,
        createdDay: updatedUser.createdDay,
      },
    });
  } catch (err) {
    console.error("Error updating user by admin:", err);
    if (err instanceof Error) {
      res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    } else {
      res.status(500).json({ message: "Server error", error: "Unknown error" });
    }
  }
};

// Get all users
export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cacheKey = "users:all";
    const cachedUsers = await redisClient.get(cacheKey);
    if (cachedUsers) {
      console.log("Cache hit for all users");
      res.status(200).json(JSON.parse(cachedUsers));
      return;
    } else {
      console.log("Cache miss for all users");
    }

    // Retrieve all users from the database
    const users = await User.find({}).sort({ createdAt: -1 });
    console.log("All members information:", users);
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(users));
    res.status(200).json(users);
  } catch (err) {
    console.error("Error during get all information of user:", err);
    if (err instanceof Error) {
      res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    } else {
      res.status(500).json({ message: "Server error", error: "Unknown error" });
    }
  }
};

// Get a user by name
export const getUserByName = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { user_name } = req.params; // Assuming name is passed as a route parameter

  try {
    const cacheKey = `users:search:${user_name}`;
    const cachedUsers = await redisClient.get(cacheKey);
    if (cachedUsers) {
      console.log("Cache hit for user search");
      res.status(200).json(JSON.parse(cachedUsers));
      return;
    } else {
      console.log("Cache miss for user search");
    }
    // Find users matching the provided name (case insensitive)
    const users = await User.find({
      user_name: {
        $regex: new RegExp(
          user_name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i",
        ),
      },
    }); // Use regex for case-insensitive search

    if (users.length > 0) {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(users));
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "No users found with that name" });
    }
  } catch (err) {
    console.error("Error during find/get people info by name:", err);
    if (err instanceof Error) {
      res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    } else {
      res.status(500).json({ message: "Server error", error: "Unknown error" });
    }
  }
};

//Disable user account
export const disableUserAccount = async (
  req: Request | any,
  res: Response,
): Promise<void> => {
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
      { new: true, runValidators: true },
    );

    console.log("isActive :", disableUser.isActive);
    await clearUserCache();

    res.status(200).json({
      message: `Account of ${disableUser.email} has been disabled successfully.`,
      User: disableUser,
    });
  } catch (err) {
    console.error("Error during disabling account:", err);
    if (err instanceof Error) {
      res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    } else {
      res.status(500).json({ message: "Server error", error: "Unknown error" });
    }
  }
};

//Enable user account
export const enableUserAccount = async (
  req: Request | any,
  res: Response,
): Promise<void> => {
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
      { new: true, runValidators: true },
    );

    console.log("isActive :", enableUser.isActive);
    await clearUserCache();

    res.status(200).json({
      message: `Account of ${enableUser.email} has been enabled successfully.`,
      User: enableUser,
    });
  } catch (err) {
    console.error("Error enabling account:", err);
    if (err instanceof Error) {
      res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    } else {
      res.status(500).json({ message: "Server error", error: "Unknown error" });
    }
  }
};

// Permanent delete user account
export const deleteAccount = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.params;
    const userAccount = await User.findOne({ email });

    if (!userAccount) {
      res.status(404).json({ message: "User account not found !" });
      return;
    }

    await User.deleteOne({ email });
    await clearUserCache();

    res
      .status(200)
      .json({ message: "User account permanently deleted", userAccount });
  } catch (error) {
    console.error("Error during deleting user account permanently:", error);
    if (error instanceof Error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    } else {
      res.status(500).json({ message: "Server error", error: "Unknown error" });
    }
  }
};
