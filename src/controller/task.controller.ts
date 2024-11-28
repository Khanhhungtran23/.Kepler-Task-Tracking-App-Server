import { Request, Response } from "express";
import Application from "../models/application.model";
import Task from "../models/task.model";
import mongoose from "mongoose";
import { deleteCache } from "../helpers/cacheHelper";

// Add task to an application
export const addTaskToApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { applicationId } = req.params;
    const { title, deadline, tag, status } = req.body.body || req.body;

    // Validate input
    if (!applicationId) {
      res.status(400).json({ message: "Application ID is required." });
      return;
    }
    if (!title || !deadline || !tag) {
      res.status(400).json({
        message: "Task details (title, deadline, tag) are required.",
      });
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

    application.tasks.push(savedTask);
    await application.save();

    // delete cache if have any updating.
    await deleteCache("applications:all");
    await deleteCache("applications:todo");
    await deleteCache("applications:implement");
    await deleteCache("applications:test");
    await deleteCache("applications:production");

    res.status(201).json({
      message: "Task added to application successfully",
      task: savedTask,
    });
  } catch (error) {
    console.error("Error creating task in application:", error);
    if (error instanceof Error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "Server error",
        error: "Unknown error",
      });
    }
  }
};

// Function to update task in application
export const updateTaskInApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { applicationId, taskId } = req.params;
    const { title, deadline, tag, status } = req.body.body || req.body;

    // Validate input
    if (!applicationId || !taskId) {
      res.status(400).json({
        message: "Application ID and Task ID are required.",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      res.status(400).json({ message: "Invalid Task ID format." });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      res.status(400).json({ message: "Invalid Application ID format." });
      return;
    }

    // Find the application
    const application = await Application.findById(applicationId);
    if (!application) {
      res.status(404).json({ message: "Application not found." });
      return;
    }

    // Check if task exists in the application's tasks array
    const taskIndex = application.tasks.findIndex(
      (task) => task._id?.toString() === taskId,
    );

    if (taskIndex === -1) {
      res.status(404).json({
        message: "Task not found in the application.",
      });
      return;
    }

    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, deadline, tag, status }, // Update fields
      { new: true, runValidators: true }, // Return updated document and run validations
    );

    if (!updatedTask) {
      res.status(404).json({
        message: "Task not updating successfully.",
      });
      return;
    }

    application.tasks[taskIndex].set({
      title: updatedTask.title,
      deadline: updatedTask.deadline,
      tag: updatedTask.tag,
      status: updatedTask.status,
    });

    // Save the application
    await application.save();
    // Clear application cache if have any updating.
    await deleteCache("applications:all");
    await deleteCache("applications:todo");
    await deleteCache("applications:implement");
    await deleteCache("applications:test");
    await deleteCache("applications:production");

    res.status(200).json({
      message: "Task updated successfully.",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task in application:", error);
    if (error instanceof Error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "Server error",
        error: "Unknown error",
      });
    }
  }
};

export const deleteTaskFromApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { applicationId, taskId } = req.params;

    // Validate input
    if (!applicationId || !taskId) {
      res.status(400).json({
        message: "Application ID and Task ID are required.",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      res.status(400).json({ message: "Invalid Application ID format." });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      res.status(400).json({ message: "Invalid Task ID format." });
      return;
    }

    // Find the application
    const application = await Application.findById(applicationId);
    if (!application) {
      res.status(404).json({ message: "Application not found." });
      return;
    }

    // Check if the task exists in the application
    const taskIndex = application.tasks.findIndex(
      (task) => task._id && task._id.equals(taskId),
    );

    if (taskIndex === -1) {
      console.warn(
        `Task with ID ${taskId} not found in application ${applicationId}.`,
      );
      res.status(404).json({
        message: "Task not found in the application.",
      });
      return;
    }

    // Remove the task from the application's tasks array
    application.tasks.splice(taskIndex, 1);
    await application.save();

    // Delete the task from the database
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      res.status(404).json({
        message: "Task not found or could not be deleted.",
      });
      return;
    }

    // Clear cache if there are updates
    await deleteCache("applications:all");
    await deleteCache("applications:todo");
    await deleteCache("applications:implement");
    await deleteCache("applications:test");
    await deleteCache("applications:production");

    res.status(200).json({
      message: "Task deleted successfully.",
      task: deletedTask,
    });
  } catch (error) {
    console.error("Error deleting task from application:", error);
    if (error instanceof Error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "Server error",
        error: "Unknown error",
      });
    }
  }
};
