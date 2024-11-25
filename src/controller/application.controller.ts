import { Request, Response } from "express";
import Application from "../models/application.model";
import User from "../models/user.model";
import mongoose from "mongoose";
import clearApplicationCache from "../helpers/clearAppCache";
import { getCache, setCache } from "../helpers/cacheHelper";
// import Task from "../models/task.model";

// Create an application
export const createApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, description, assets, status, priority, teamMembers } =
      req.body.body || req.body;

    // Ensure required fields are present
    if (!title || !description || !status || !priority) {
      res.status(400).json({
        message: "Title, description, status, and priority are required",
      });
      return;
    }

    const existingApplication = await Application.findOne({ title });
    if (existingApplication) {
      res.status(409).json({
        message: `An application with the title "${title}" already exists.`,
      });
      return; // Exit early if duplicate found
    }

    // Validate teamMembers (ensure IDs exist in User collection)
    if (teamMembers && teamMembers.length > 0) {
      const validUsers = await User.find({ _id: { $in: teamMembers } });
      if (validUsers.length !== teamMembers.length) {
        res.status(400).json({ message: "Some team members are invalid." });
        return;
      }
    }

    // Create a new Application without tasks or team members initially
    const newApplication = new Application({
      title,
      description,
      assets: assets || [],
      status,
      priority,
      tasks: [], // No tasks initially
      teamMembers: teamMembers || [],
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
export const getApplications = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const cacheKey = "applications:all";
  try {
    // check cache first if yes or not
    const cachedApplications = await getCache(cacheKey);
    if (cachedApplications) {
      res.status(200).json(cachedApplications);
      return;
    }
    // command to get from db server
    const applications = await Application.find({ isTrashed: false })
      .populate("tasks")
      .populate("teamMembers")
      .exec();

    // store in cache, expire in 1h = 3600s
    await setCache(cacheKey, applications, 3600);

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
export const getTodoApplications = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const cacheKey = "applications:todo";
  try {
    const cachedTodoApplications = await getCache(cacheKey);
    if (cachedTodoApplications) {
      res.status(200).json(cachedTodoApplications);
      return;
    }

    const applications = await Application.find({
      isTrashed: false,
      status: "To Do",
    });

    await setCache(cacheKey, applications, 3600);

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
export const getImplementApplications = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const cacheKey = "applications:implement";
  try {
    const cachedImplementApplications = await getCache(cacheKey);
    if (cachedImplementApplications) {
      res.status(200).json(cachedImplementApplications);
      return;
    }

    const applications = await Application.find({
      isTrashed: false,
      status: "Implement",
    })
      // .populate('tasks')
      .populate("teamMembers")
      .exec();

    // save cahche
    await setCache(cacheKey, applications, 3600);

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
export const getTestingApplications = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const cacheKey = "applications:test";
  try {
    const cachedTestApplications = await getCache(cacheKey);
    if (cachedTestApplications) {
      res.status(200).json(cachedTestApplications);
      return;
    }

    const applications = await Application.find({
      isTrashed: false,
      status: "Testing",
    })
      // .populate('tasks')
      .populate("teamMembers")
      .exec();
    // save cache
    await setCache(cacheKey, applications, 3600);

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
): Promise<void> => {
  const cacheKey = "applications:production";
  try {
    const cachedProductionApplications = await getCache(cacheKey);
    if (cachedProductionApplications) {
      res.status(200).json(cachedProductionApplications);
      return;
    }

    const applications = await Application.find({
      isTrashed: false,
      status: "Production",
    })
      // .populate('tasks')
      .populate("teamMembers")
      .exec();
    // save cache
    await setCache(cacheKey, applications, 3600);

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
  const cacheKey = `applications:search:${application_title}`;
  try {
    const cachedApplications = await getCache(cacheKey);
    if (cachedApplications) {
      res.status(200).json(cachedApplications);
      return;
    }

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
      await setCache(cacheKey, apps, 900);
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
  const cacheKey = `applications:tdsearch:${application_title}`;
  try {
    const cachedSTodoApplications = await getCache(cacheKey);
    if (cachedSTodoApplications) {
      res.status(200).json(cachedSTodoApplications);
      return;
    }

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
      await setCache(cacheKey, apps, 900);
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
  const cacheKey = `applications:itsearch:${application_title}`;
  try {
    const cachedSImplementApplications = await getCache(cacheKey);
    if (cachedSImplementApplications) {
      res.status(200).json(cachedSImplementApplications);
      return;
    }

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
      await setCache(cacheKey, apps, 900);
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
  const cacheKey = `applications:tgsearch:${application_title}`;
  try {
    const cachedSTestingApplications = await getCache(cacheKey);
    if (cachedSTestingApplications) {
      res.status(200).json(cachedSTestingApplications);
      return;
    }

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
      await setCache(cacheKey, apps, 900);
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
  const cacheKey = `applications:pnsearch:${application_title}`;
  try {
    const cachedSProductionApplications = await getCache(cacheKey);
    if (cachedSProductionApplications) {
      res.status(200).json(cachedSProductionApplications);
      return;
    }

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
      await setCache(cacheKey, apps, 900);
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
  const cacheKey = `TrashApplication:all`;
  try {
    const cachedTrashedApplications = await getCache(cacheKey);
    if (cachedTrashedApplications) {
      res.status(200).json(cachedTrashedApplications);
      return;
    }

    const trashedApplications = await Application.find({ isTrashed: true })
      .populate("teamMembers")
      .exec();
    // save cache
    await setCache(cacheKey, trashedApplications, 3600);

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
  const cacheKey = "application:status-count";
  try {
    const cachedCounts = await getCache(cacheKey);
    if (cachedCounts) {
      res.status(200).json({
        message: "Applications count by status:",
        ...cachedCounts,
      });
      return;
    }

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

    const result = {
      untrashedStatistic: untrashedCounts,
      trashedStatistic: trashedCounts,
    };

    await setCache(cacheKey, result, 3600);

    res.status(200).json({
      message: "Applications count by status:",
      ...result,
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
  const cacheKey = "application:priority-count";
  try {
    const cachedCounts = await getCache(cacheKey);
    if (cachedCounts) {
      res.status(200).json({
        message: "Applications count by priority:",
        Statistic: cachedCounts,
      });
      return;
    }

    const counts = await Application.aggregate([
      { $match: { isTrashed: { $ne: true } } }, // Exclude trashed applications
      { $group: { _id: "$priority", count: { $sum: 1 } } }, // Group by priority and count
      { $project: { _id: 0, priority: "$_id", count: 1 } },
    ]);

    await setCache(cacheKey, counts, 3600);
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
  const cacheKey = "users:applications-count";
  try {
    const cachedCounts = await getCache(cacheKey);
    if (cachedCounts) {
      res.status(200).json(cachedCounts);
      return;
    }

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
      { $match: { "userDetails.user_name": { $ne: null } } },
      {
        $group: {
          _id: "$userDetails._id",
          user_name: { $first: "$userDetails.user_name" },
          total_app: { $sum: 1 },
          details: {
            $push: {
              status: "$status",
              count: { $sum: 1 },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          user_name: 1,
          total_app: 1,
          details: 1,
        },
      },
    ]);

    if (!counts || counts.length === 0) {
      res.status(200).json({
        message: "No data available for applications count",
        Statistic: [],
      });
    }

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
    await setCache(cacheKey, response, 3600);
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
    if (!application.teamMembers.some((member) => member.equals(userId))) {
      application.teamMembers.push(new mongoose.Types.ObjectId(userId));
    }

    try {
      await application.save();
      console.log("Application updated:", application);
    } catch (error) {
      console.error("Error saving application:", error);
      res.status(500).json({ message: "Failed to save application" });
      return;
    }

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
