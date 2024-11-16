import { Request, Response } from "express";
import Application from "../models/application.model";
import User from "../models/user.model";
import mongoose from "mongoose";

// Create an application
export const createApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, description, assets, status, priority } =
      req.body.body || req.body;

    // Ensure required fields are present
    if (!title || !description || !status || !priority) {
      res.status(400).json({
        message: "Title, description, status, and priority are required",
      });
    }

    // Create a new Application without tasks or team members initially
    const newApplication = new Application({
      title,
      description,
      assets: assets || [],
      status,
      priority,
      tasks: [], // No tasks initially
      teamMembers: [], // No team members initially
    });

    // Save the new application to the database
    const savedApplication = await newApplication.save();
    res.status(201).json({
      message: "Application created successfully",
      application: savedApplication,
    });
  } catch (error) {
    console.error("Error creating application:", error);
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

// Edit an application
export const editApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, assets, status, priority, tasks, teamMembers } =
      req.body.body || req.body;

    // Find and update the application
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { title, description, assets, status, priority, tasks, teamMembers },
      { new: true },
    );

    if (!updatedApplication) {
      res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Application updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Error during editing application:", error);
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

// Soft delete (move to trash section)
export const trashApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title } = req.params;

    const trashedApplication = await Application.findOneAndUpdate(
      { title: title },
      { isTrashed: true },
      { new: true },
    );

    if (!trashedApplication) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    res.status(200).json({
      message: "Application moved to trash",
      application: trashedApplication,
    });
  } catch (error) {
    console.error("Error during trashing application:", error);
    if (error instanceof Error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "Server error while trashing application" });
    }
  }
};

// Permanent delete (only if trashed)
export const deleteApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);

    if (!application || !application.isTrashed) {
      res
        .status(404)
        .json({ message: "Application not found or not in trash" });
    }

    await Application.findByIdAndDelete(id);
    res.status(200).json({ message: "Application permanently deleted" });
  } catch (error) {
    console.error("Error during deleting application permanently:", error);
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

// Get all untrashed applications (excluding trashed)
export const getApplications = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find({ isTrashed: false })
      // .populate('tasks')
      .populate("teamMembers")
      .exec();

    res.status(200).json({ applications });
  } catch (error) {
    console.error("Error during fetching info of all applications:", error);
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

export const searchApp = async (req: Request, res: Response): Promise<void> => {
  const { application_title } = req.params; // Assuming application title is passed as a route parameter

  try {
    // Find application matching the provided application_title (case insensitive)
    const apps = await Application.find({
      title: { $regex: new RegExp(application_title, "i") },
      isTrashed: false,
    }); // Use regex for case-insensitive search

    if (apps.length > 0) {
      res.status(200).json(apps);
    } else {
      res.status(404).json({ message: "No application found with that title" });
    }
  } catch (err) {
    console.log("Error during searching app by title: " + err);
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

export const searchTodoApp = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { application_title } = req.params; // Assuming application title is passed as a route parameter

  try {
    // Find applications matching the application_title and status = "To Do" (case insensitive)
    const apps = await Application.find({
      title: { $regex: new RegExp(application_title, "i") },
      status: "To Do",
      isTrashed: false,
    });

    if (apps.length > 0) {
      res.status(200).json(apps);
    } else {
      res.status(404).json({ message: "No application found with that title" });
    }
  } catch (err) {
    console.log("Error during searching todo app by title: " + err);
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

export const searchImplementApp = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { application_title } = req.params; // Assuming application title is passed as a route parameter

  try {
    // Find applications matching the application_title and status = "Implementing" (case insensitive)
    const apps = await Application.find({
      title: { $regex: new RegExp(application_title, "i") },
      status: "Implement",
      isTrashed: false,
    });

    if (apps.length > 0) {
      res.status(200).json(apps);
    } else {
      res.status(404).json({ message: "No application found with that title" });
    }
  } catch (err) {
    console.log("Error during seaching implement app by title: " + err);
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

export const searchTestingApp = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { application_title } = req.params; // Assuming application title is passed as a route parameter

  try {
    // Find applications matching the application_title and status = "Testing" (case insensitive)
    const apps = await Application.find({
      title: { $regex: new RegExp(application_title, "i") },
      status: "Testing",
      isTrashed: false,
    });

    if (apps.length > 0) {
      res.status(200).json(apps);
    } else {
      res.status(404).json({ message: "No application found with that title" });
    }
  } catch (err) {
    console.log("Error during searching testing app by title: " + err);
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

export const searchProductionApp = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { application_title } = req.params; // Assuming application title is passed as a route parameter

  try {
    // Find applications matching the application_title and status = "Implementing" (case insensitive)
    const apps = await Application.find({
      title: { $regex: new RegExp(application_title, "i") },
      status: "Production",
      isTrashed: false,
    });

    if (apps.length > 0) {
      res.status(200).json(apps);
    } else {
      res.status(404).json({ message: "No application found with that title" });
    }
  } catch (err) {
    console.log("Error during searching production app by title:" + err);
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

// Restore the trashed application (turn back to application tab)
export const restoreApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title } = req.params;

    const restoredApplication = await Application.findOneAndUpdate(
      { title: title },
      { isTrashed: false },
      { new: true },
    );

    if (!restoredApplication) {
      res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Application is restored",
      application: restoredApplication,
    });
  } catch (error) {
    console.error("Error restoring application from trash:", error);
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

// Get all trashed applications (including trashed)
export const getTrashedApplications = async (req: Request, res: Response) => {
  try {
    const trashedApplications = await Application.find({ isTrashed: true })
      .populate("teamMembers")
      .exec();

    res.status(200).json({ trashedApplications });
  } catch (error) {
    console.error(
      "Error during fetching list of applications in trash:",
      error,
    );
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

//Get number of application by status
export const countApplicationsByStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const counts = await Application.aggregate([
      { $match: { isTrashed: { $ne: true } } }, // exclude trashed applications
      { $group: { _id: "$status", count: { $sum: 1 } } }, // group by status and count
      {
        $group: {
          _id: null,
          total: { $sum: "$count" }, // Calculate the total count of all applications
          detail: { $push: { status: "$_id", count: "$count" } }, // Collect data into an array
        },
      },
      { $project: { _id: 0, total: 1, detail: 1 } },
    ]);

    res
      .status(200)
      .json({ message: "Applications count by status", Statistic: counts });
  } catch (error) {
    console.error("Error counting applications by status:", error);
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

//Get number of application by priority
export const countApplicationsByPriority = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const counts = await Application.aggregate([
      { $match: { isTrashed: { $ne: true } } }, // Exclude trashed applications
      { $group: { _id: "$priority", count: { $sum: 1 } } }, // Group by priority and count
      { $project: { _id: 0, priority: "$_id", count: 1 } },
    ]);

    res
      .status(200)
      .json({ message: "Applications count by priority", Statistic: counts });
  } catch (error) {
    console.error("Error counting applications by priority:", error);
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

// Get number of applications for each user
export const countApplicationsPerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Aggregate to count applications for each user
    const counts = await Application.aggregate([
      { $match: { isTrashed: { $ne: true } } }, // Exclude trashed applications
      { $unwind: "$teamMembers" }, // Unwind teamMembers array
      { $group: { _id: "$teamMembers", count: { $sum: 1 } } }, // Count applications per user
      {
        $project: {
          _id: 0,
          id: "$_id", // Rename _id to id
          count: 1,
        },
      },
    ]);

    // Prepare response format
    const response = {
      message: "Applications count for each member",
      Statistic: [
        {
          "total user": counts.length,
          detail: counts,
        },
      ],
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error counting no of applications per user:", error);
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

// Function to add member to Application
export const addMemberToApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { appId, userId } = req.body.body || req.body;

    if (
      !mongoose.Types.ObjectId.isValid(appId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      res
        .status(400)
        .json({ message: "Invalid application ID or user ID format" });
      return;
    }

    const application = await Application.findById(appId);
    if (!application) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (application.teamMembers.includes(userId)) {
      res
        .status(400)
        .json({ message: "User is already a member of this application" });
      return;
    }

    // add user into array teamMembers of application
    application.teamMembers.push(userId);
    await application.save();

    res.status(200).json({
      message: "User added to application successfully",
      application,
    });
  } catch (error) {
    console.error("Error adding/assigning member to application:", error);
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
