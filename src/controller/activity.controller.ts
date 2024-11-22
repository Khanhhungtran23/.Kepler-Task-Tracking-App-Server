import { Request, Response } from "express";
import Application from "../models/application.model";
import User from "../models/user.model";
import Activity from "../models/activity.model";
import mongoose from "mongoose";
// import redisClient from "../utils/redis";
import clearApplicationCache from "../helpers/clearAppCache";

// Function to add new activity/comment to Application
export const addActivity = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { title, comment, appId } = req.body.body || req.body;
      const userId = req.user?._id;
  
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const user_name = user.user_name;
  
      if (!mongoose.Types.ObjectId.isValid(appId)) {
        res.status(400).json({ message: "Invalid appId format" });
        return;
      }
  
      const application = await Application.findById(appId);
      if (!application) {
        res.status(404).json({ message: "Application not found" });
        return;
      }
  
      const newActivity = new Activity({
        title,
        comment,
        user_name,
      });
      await newActivity.save();
  
      application.activities.push({
        _id: newActivity._id,
        title: newActivity.title,
        comment: newActivity.comment,
        user_name: newActivity.user_name,
      });
      await application.save();
  
      // DELETE cache to reset cache
      await clearApplicationCache();
  
      res.status(200).json({
        message: "Acitivity are added to application successfully:",
        application,
      });
    } catch (error) {
      console.error("Error adding new comment/activity to application:", error);
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
  