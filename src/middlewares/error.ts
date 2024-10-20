import { Request, Response, NextFunction } from "express";

// Route Not Found Middleware
const routeNotFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404); // Set the status code to 404
  next(error); // Pass the error to the error handler
};

// Extending Error interface for better TypeScript support
interface CustomError extends Error {
  name: string;
  kind?: string;  // `kind` is specific to Mongoose CastError
}

// Error Handler Middleware
const errorHandler = (
  err: CustomError, // Custom error type
  req: Request,
  res: Response,
  next: NextFunction // Correct typing for NextFunction
) => {
  // Default status code is 500 (Internal Server Error)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle invalid ObjectId errors from Mongoose
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404; // Not found for invalid ObjectId
    message = "Resource not found";
  }

  // Respond with error message and stack trace (if in development)
  res.status(statusCode).json({
    message: message,
    // Show the stack trace only in development mode
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { routeNotFound, errorHandler };
