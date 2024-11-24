import { Request, Response } from "express";
import Application from "../models/application.model";
import Task from "../models/task.model";
import clearApplicationCache from "../helpers/clearAppCache";

// Add task to an application
export const addTaskToApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { applicationId } = req.params; 
    const { title, deadline, tag, status } = req.body.body || req.body; 

    // Validate input
    if (!applicationId) {
        res.status(400).json({ message: "Application ID is required." });
        return;
      }
    if (!title || !deadline || !tag) {
        res.status(400).json({ message: "Task details (title, deadline, tag) are required." });
        return;
    }

    // Find the application
    const application = await Application.findById(applicationId);
    if (!application) {
      res.status(404).json({
        message: "Application not found.",
      });
      return;
    }

    // Create a new task
    const newTask = new Task({
        title,
        deadline,
        tag,
        status: status || "To Do", // Default status if not provided
      });  

    const savedTask = await newTask.save();

    // Add task ID to application's tasks array
    application.tasks.push(savedTask._id);
    await application.save();

    await clearApplicationCache();
    res.status(201).json({
      message: "Task added to application successfully",
      task: savedTask,
    });
  } catch (error) {
    console.error("Error adding task to application:", error);
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
