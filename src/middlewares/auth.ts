import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import mongoose from "mongoose";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };

      const user = await User.findById(decoded._id).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Explicitly cast user._id to mongoose.Types.ObjectId or string
      req.user = { _id: user._id as mongoose.Types.ObjectId, isAdmin: user.isAdmin };

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
