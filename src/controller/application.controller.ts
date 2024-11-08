import { Request, Response } from "express";
import Application from "../models/application.model";

// Create an application
export const createApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, assets, status, priority } = req.body;

    // Ensure required fields are present
    if (!title || !description || !status || !priority) {
      res.status(400).json({ message: 'Title, description, status, and priority are required' });
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
    res.status(201).json({ message: 'Application created successfully', application: savedApplication });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ message: 'Server error while creating application' });
  }
};

// Edit an application
export const editApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, assets, status, priority, tasks, teamMembers } = req.body;

    // Find and update the application
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { title, description, assets, status, priority, tasks, teamMembers },
      { new: true }
    );

    if (!updatedApplication) {
      res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ message: 'Application updated successfully', application: updatedApplication });
  } catch (error) {
    console.error('Error editing application:', error);
    res.status(500).json({ message: 'Server error while editing application' });
  }
};

// Soft delete (move to trash)
export const trashApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = req.params;

    const trashedApplication = await Application.findByIdAndUpdate(
      { title: title },
      { isTrashed: true },
      { new: true }
    );

    if (!trashedApplication) {
      res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ message: 'Application moved to trash', application: trashedApplication });
  } catch (error) {
    console.error('Error trashing application:', error);
    res.status(500).json({ message: 'Server error while trashing application' });
  }
};

// Permanent delete (only if trashed)
export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);

    if (!application || !application.isTrashed) {
      res.status(404).json({ message: 'Application not found or not in trash' });
    }

    await Application.findByIdAndDelete(id);
    res.status(200).json({ message: 'Application permanently deleted' });
  } catch (error) {
    console.error('Error deleting application permanently:', error);
    res.status(500).json({ message: 'Server error while deleting application' });
  }
};

// Get all applications (excluding trashed)
export const getApplications = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find({ isTrashed: false })
      // .populate('tasks')
      .populate('teamMembers')
      .exec();

    res.status(200).json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error while fetching applications' });
  }
};

export const searchApp = async (req: Request, res: Response): Promise<void> => {
  const { application_title } = req.params; // Assuming application title is passed as a route parameter

  try {
    // Find application matching the provided application_title (case insensitive)
    const apps = await Application.find({ 
      title: { $regex: new RegExp(application_title, "i")},
      isTrashed: false  
    }); // Use regex for case-insensitive search

    if (apps.length > 0) {
      res.status(200).json(apps);
    } else {
      res.status(404).json({ message: "No application found with that title" });
    }
  } catch (err) {
    console.log("Error: " + err)
    res.status(500).json({ message: "Server error" });
  }
};

export const searchTodoApp = async (req: Request, res: Response): Promise<void> => {
  const { application_title } = req.params; // Assuming application title is passed as a route parameter

  try {
    // Find applications matching the application_title and status = "To Do" (case insensitive)
    const apps = await Application.find({ 
      title: { $regex: new RegExp(application_title, "i") },
      status: "To Do",
      isTrashed: false
   });

    if (apps.length > 0) {
      res.status(200).json(apps);
    } else {
      res.status(404).json({ message: "No application found with that title" });
    }
  } catch (err) {
    console.log("Error: " + err)
    res.status(500).json({ message: "Server error" });
  }
};

export const searchImplementApp = async (req: Request, res: Response): Promise<void> => {
  const { application_title } = req.params; // Assuming application title is passed as a route parameter

  try {
    // Find applications matching the application_title and status = "Implementing" (case insensitive)
    const apps = await Application.find({ 
      title: { $regex: new RegExp(application_title, "i") },
      status: "Implement",
      isTrashed: false
   });

    if (apps.length > 0) {
      res.status(200).json(apps);
    } else {
      res.status(404).json({ message: "No application found with that title" });
    }
  } catch (err) {
    console.log("Error: " + err)
    res.status(500).json({ message: "Server error" });
  }
};

export const searchTestingApp = async (req: Request, res: Response): Promise<void> => {
  const { application_title } = req.params; // Assuming application title is passed as a route parameter

  try {
    // Find applications matching the application_title and status = "Testing" (case insensitive)
    const apps = await Application.find({ 
      title: { $regex: new RegExp(application_title, "i") },
      status: "Testing",
      isTrashed: false
   });

    if (apps.length > 0) {
      res.status(200).json(apps);
    } else {
      res.status(404).json({ message: "No application found with that title" });
    }
  } catch (err) {
    console.log("Error: " + err)
    res.status(500).json({ message: "Server error" });
  }
};

export const searchProductionApp = async (req: Request, res: Response): Promise<void> => {
  const { application_title } = req.params; // Assuming application title is passed as a route parameter

  try {
    // Find applications matching the application_title and status = "Implementing" (case insensitive)
    const apps = await Application.find({ 
      title: { $regex: new RegExp(application_title, "i") },
      status: "Production",
      isTrashed: false
   });

    if (apps.length > 0) {
      res.status(200).json(apps);
    } else {
      res.status(404).json({ message: "No application found with that title" });
    }
  } catch (err) {
    console.log("Error: " + err)
    res.status(500).json({ message: "Server error" });
  }
};