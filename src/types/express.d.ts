import mongoose from "mongoose";

// Extend Express Request interface globally
declare global {
  namespace Express {
    export interface Request {
      user?: {
        _id: mongoose.Types.ObjectId | string;
        isAdmin: boolean;
      }; // user is now an object with _id and isAdmin
    }
  }
}
