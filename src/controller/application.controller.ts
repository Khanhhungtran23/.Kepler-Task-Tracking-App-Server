import { Request, Response } from "express";
import Application from "../models/application.model";
import User from "../models/user.model";
import mongoose from "mongoose";
import redisClient from "../utils/redis";
import clearApplicationCache from "../helpers/clearAppCache";

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

    // DELETE cache to reset cache
    await clearApplicationCache();

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

// Function to duplicate application
export const duplicateApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log(req.params);
    const { id } = req.params; // Application ID to be duplicated
    const { includeRelations } = req.body.body || req.body; // boolean value : if user want to copy the relations or not ?

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid application ID" });
      return;
    }

    const existingApplication = await Application.findById(id).lean();
    if (!existingApplication) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    const newTitle = `${existingApplication.title} - Copy`;

    const duplicatedApplication = new Application({
      ...existingApplication, // copy app be duplicated into new app
      _id: undefined,
      title: newTitle,
      createdAt: undefined,
      updatedAt: undefined,
      tasks: includeRelations ? existingApplication.tasks : [],
      teamMembers: includeRelations ? existingApplication.teamMembers : [],
    });

    // Save the duplicated application
    const savedApplication = await duplicatedApplication.save();

    // DELETE cache to reset cache
    await clearApplicationCache();

    res.status(201).json({
      message: "Application duplicated successfully",
      application: savedApplication,
    });
  } catch (error) {
    console.error("Error duplicating application:", error);
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

    // DELETE cache to reset cache
    await clearApplicationCache();

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

    // DELETE cache to reset cache
    await clearApplicationCache();

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

    // DELETE cache to reset cache
    await clearApplicationCache();

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
    const cacheKey = "application:all";

    // check cache first if yes or not
    const cachedApplications = await redisClient.get(cacheKey);
    if (cachedApplications) {
      console.log("Cache hit for all applications");
      res.status(200).json(JSON.parse(cachedApplications));
      return;
    }

    // If not in cache, get from database
    else console.log("Cache miss for all applications");
    // command to get from db server
    const applications = await Application.find({ isTrashed: false })
      // .populate('tasks')
      .populate("teamMembers")
      .exec();

    // store in cache, expire in 1h = 3600s
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(applications));

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

// Get all untrashed applications (excluding trashed)
export const getTodoApplications = async (req: Request, res: Response) => {
  try {
    const cacheKey = "applications:todo";

    const cachedTodoApplications = await redisClient.get(cacheKey);
    if (cachedTodoApplications) {
      console.log("Cache hit for To Do applications");
      res.status(200).json(JSON.parse(cachedTodoApplications));
      return;
    } else console.log("Cache miss for To Do applications");

    const applications = await Application.find({
      isTrashed: false,
      status: "To Do",
    });

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(applications));

    res.status(200).json({ applications });
  } catch (error) {
    console.error(
      "Error during fetching info of all to do applications:",
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

// Get all untrashed applications (excluding trashed)
export const getImplementApplications = async (req: Request, res: Response) => {
  try {
    const cacheKey = "applications:implement";
    const cachedImplementApplications = await redisClient.get(cacheKey);
    if (cachedImplementApplications) {
      console.log("Cache hit for Implement applications");
      res.status(200).json(JSON.parse(cachedImplementApplications));
      return;
    } else console.log("Cache miss for Implement applications");

    const applications = await Application.find({
      isTrashed: false,
      status: "Implement",
    })
      // .populate('tasks')
      .populate("teamMembers")
      .exec();

    // save cahche
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(applications));

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

// Get all untrashed applications (excluding trashed)
export const getTestingApplications = async (req: Request, res: Response) => {
  try {
    const cacheKey = "applications:test";
    const cachedTestApplications = await redisClient.get(cacheKey);
    if (cachedTestApplications) {
      console.log("Cache hit for Test applications");
      res.status(200).json(JSON.parse(cachedTestApplications));
      return;
    } else console.log("Cache miss for Test applications");

    const applications = await Application.find({
      isTrashed: false,
      status: "Testing",
    })
      // .populate('tasks')
      .populate("teamMembers")
      .exec();
    // save cache
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(applications));

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

// Get all untrashed applications (excluding trashed)
export const getProductionApplications = async (
  req: Request,
  res: Response,
) => {
  try {
    const cacheKey = "applications:prod";
    const cachedProdApplications = await redisClient.get(cacheKey);
    if (cachedProdApplications) {
      console.log("Cache hit for Production applications");
      res.status(200).json(JSON.parse(cachedProdApplications));
      return;
    } else console.log("Cache miss for Production applications");

    const applications = await Application.find({
      isTrashed: false,
      status: "Production",
    })
      // .populate('tasks')
      .populate("teamMembers")
      .exec();
    // save cache
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(applications));
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
    const cacheKey = `applications:search:${application_title}`;
    const cachedApplications = await redisClient.get(cacheKey);
    if (cachedApplications) {
      console.log("Cache hit for search applications");
      res.status(200).json(JSON.parse(cachedApplications));
      return;
    } else console.log("Cache miss for search applications");

    // Find application matching the provided application_title (case insensitive)
    const apps = await Application.find({
      title: {
        $regex: new RegExp(
          application_title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i",
        ),
      },
      isTrashed: false,
    }); // Use regex for case-insensitive search

    if (apps.length > 0) {
      // save cache
      await redisClient.setEx(cacheKey, 1800, JSON.stringify(apps));
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
    const cacheKey = `applications:search:${application_title}`;
    const cachedApplications = await redisClient.get(cacheKey);
    if (cachedApplications) {
      console.log("Cache hit for search Todo applications");
      res.status(200).json(JSON.parse(cachedApplications));
      return;
    } else console.log("Cache miss for search Todo applications");

    // Find applications matching the application_title and status = "To Do" (case insensitive)
    const apps = await Application.find({
      title: {
        $regex: new RegExp(
          application_title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i",
        ),
      },
      status: "To Do",
      isTrashed: false,
    });

    if (apps.length > 0) {
      // save cache
      await redisClient.setEx(cacheKey, 1800, JSON.stringify(apps));
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
    const cacheKey = `applications:search:${application_title}`;
    const cachedApplications = await redisClient.get(cacheKey);
    if (cachedApplications) {
      console.log("Cache hit for search Implement applications");
      res.status(200).json(JSON.parse(cachedApplications));
      return;
    } else console.log("Cache miss for search Implement applications");

    // Find applications matching the application_title and status = "Implementing" (case insensitive)
    const apps = await Application.find({
      title: {
        $regex: new RegExp(
          application_title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i",
        ),
      },
      status: "Implement",
      isTrashed: false,
    });

    if (apps.length > 0) {
      // save cache
      await redisClient.setEx(cacheKey, 1800, JSON.stringify(apps));
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
    const cacheKey = `applications:search:${application_title}`;
    const cachedApplications = await redisClient.get(cacheKey);
    if (cachedApplications) {
      console.log("Cache hit for search Test applications");
      res.status(200).json(JSON.parse(cachedApplications));
      return;
    } else console.log("Cache miss for search Test applications");
    // Find applications matching the application_title and status = "Testing" (case insensitive)
    const apps = await Application.find({
      title: {
        $regex: new RegExp(
          application_title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i",
        ),
      },
      status: "Testing",
      isTrashed: false,
    });

    if (apps.length > 0) {
      // save cache
      await redisClient.setEx(cacheKey, 1800, JSON.stringify(apps));
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
    const cacheKey = `applications:search:${application_title}`;
    const cachedApplications = await redisClient.get(cacheKey);
    if (cachedApplications) {
      console.log("Cache hit for search Production applications");
      res.status(200).json(JSON.parse(cachedApplications));
      return;
    } else console.log("Cache miss for search Production applications");

    // Find applications matching the application_title and status = "Implementing" (case insensitive)
    const apps = await Application.find({
      title: {
        $regex: new RegExp(
          application_title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i",
        ),
      },
      status: "Production",
      isTrashed: false,
    });

    if (apps.length > 0) {
      await redisClient.setEx(cacheKey, 1800, JSON.stringify(apps));
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

    // DELETE cache to reset cache
    await clearApplicationCache();

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
    const cacheKey = `TrashApplication:all`;
    const cachedApplications = await redisClient.get(cacheKey);
    if (cachedApplications) {
      console.log("Cache hit for get all trash applications");
      res.status(200).json(JSON.parse(cachedApplications));
      return;
    } else console.log("Cache miss for get all trash applications");

    const trashedApplications = await Application.find({ isTrashed: true })
      .populate("teamMembers")
      .exec();
    // save cache
    await redisClient.setEx(
      cacheKey,
      1800,
      JSON.stringify(trashedApplications),
    );
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
    const cacheKey = "applications:status-count";
    const cachedCounts = await redisClient.get(cacheKey);
    if (cachedCounts) {
      console.log("Cache hit for status count");
      res.status(200).json(JSON.parse(cachedCounts));
      return;
    } else console.log("Cache miss for status count");

    const untrashedCounts = await Application.aggregate([
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

    const trashedCounts = await Application.aggregate([
      { $match: { isTrashed: { $ne: false } } }, // Include trashed applications
      { $group: { _id: "$status", count: { $sum: 1 } } }, // Group by priority and count
      {
        $group: {
          _id: null,
          total: { $sum: "$count" }, // Calculate the total count of all applications
          detail: { $push: { status: "$_id", count: "$count" } }, // Collect data into an array
        },
      },
      { $project: { _id: 0, total: 1, detail: 1 } },
    ]);

    await redisClient.setEx(
      cacheKey,
      3600,
      JSON.stringify(untrashedCounts, trashedCounts),
    );
    res.status(200).json({
      message: "Applications count by status",
      unstrashedStatistic: untrashedCounts,
      trashedStatistic: trashedCounts,
    });
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
    const cacheKey = "applications:priority-count";
    const cachedCounts = await redisClient.get(cacheKey);
    if (cachedCounts) {
      console.log("Cache hit for priority count");
      res.status(200).json(JSON.parse(cachedCounts));
      return;
    } else console.log("Cache miss for priority count");

    const counts = await Application.aggregate([
      { $match: { isTrashed: { $ne: true } } }, // Exclude trashed applications
      { $group: { _id: "$priority", count: { $sum: 1 } } }, // Group by priority and count
      { $project: { _id: 0, priority: "$_id", count: 1 } },
    ]);

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(counts));
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
    const cacheKey = "users:applications-count";
    const cachedCounts = await redisClient.get(cacheKey);
    if (cachedCounts) {
      console.log("Cache hit for app per user count");
      res.status(200).json(JSON.parse(cachedCounts));
      return;
    } else console.log("Cache miss for app per user count");

    const counts = await Application.aggregate([
      { $match: { isTrashed: { $ne: true } } },
      {
        $lookup: {
          from: "users",
          localField: "teamMembers",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $group: {
          _id: {
            user_name: "$userDetails.name",
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.user_name",
          total_app: { $sum: "$count" },
          details: {
            $push: {
              status: "$_id.status",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          user_name: "$_id",
          total_app: 1,
          details: 1,
        },
      },
    ]);

    const totalUsers = counts.length;

    const response = {
      message: "Applications count for each member",
      Statistic: [
        {
          "total user": totalUsers,
          detail: counts,
        },
      ],
    };
    // save cache
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(counts));
    res.status(200).json(response);
  } catch (error) {
    console.error(
      "Error counting number and details of applications per user:",
      error,
    );
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
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

    if (application.teamMembers.some((member) => member.equals(userId))) {
      res
        .status(400)
        .json({ message: "User is already a member of this application" });
      return;
    }

    // add user into array teamMembers of application
    application.teamMembers.push(userId);
    await application.save();

    // DELETE cache to reset cache
    await clearApplicationCache();

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
