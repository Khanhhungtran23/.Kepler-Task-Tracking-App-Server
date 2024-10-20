import { Request, Response } from "express";
import Application from "../models/application.model";
// import mongoose from "mongoose";

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

    // Only admins can edit applications
    if (!req.user?.isAdmin) {
      res.status(403).json({ message: 'Only admins can edit applications' });
    }

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
    const { id } = req.params;

    // Only admins can trash applications
    if (!req.user?.isAdmin) {
      res.status(403).json({ message: 'Only admins can trash applications' });
    }

    const trashedApplication = await Application.findByIdAndUpdate(
      id,
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

    // Only admins can delete applications permanently
    if (!req.user?.isAdmin) {
      res.status(403).json({ message: 'Only admins can delete applications permanently' });
    }

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
      .populate('tasks')
      .populate('teamMembers')
      .exec();

    res.status(200).json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error while fetching applications' });
  }
};
