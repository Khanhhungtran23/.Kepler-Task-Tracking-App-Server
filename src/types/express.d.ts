import { Request } from "express";
import mongoose from "mongoose";
import { IUser } from "./models/user.model";

// Extend Express Request interface globally
declare global {
  namespace Express {
    export interface Request {
      user?: {
        _id: mongoose.Types.ObjectId | any;
        isAdmin: boolean;
      };  // user is now an object with _id and isAdmin
    }
  }
}
