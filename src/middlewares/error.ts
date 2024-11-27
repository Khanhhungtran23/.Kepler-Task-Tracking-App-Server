/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import logger from "../configs/logger.config";

// Route Not Found Middleware
const routeNotFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error); // -> errorHandler
};

// CustomError Interface
interface CustomError extends Error {
  name: string;
  kind?: string; // `kind` used for Mongoose CastError
  statusCode?: number;
}

// Error Handler Middleware
const errorHandler = (
  err: CustomError, // Custom error type
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Xử lý lỗi ObjectId không hợp lệ từ Mongoose (CastError)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    res.status(404);
    message = "Resource not found";
  }

  // Response with message and stack trace (chỉ hiện stack trong dev environment)
  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export { routeNotFound, errorHandler };
