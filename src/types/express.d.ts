// types/express.d.ts
import * as express from "express";
import { Types } from "mongoose";

// Extend the Express Request interface to include the `user` property
declare global {
  namespace Express {
    interface Request {
      user?: string; // User can be of type ObjectId or string
    }
  }
}
