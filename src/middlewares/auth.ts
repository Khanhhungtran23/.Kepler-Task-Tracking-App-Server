import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import logger from "../configs/logger.config";

// interface AuthRequest extends Request {
//   user?: {
//     _id: mongoose.Types.ObjectId | string;
//     isAdmin: boolean;
//   };
// }

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let token: string | undefined;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    logger.info("Token from cookie:", token); // Debug
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    logger.info("Token from header:", token); // Debug
  }

  if (!token) {
    logger.info("No token provided");
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    logger.info("Decoded token:", decoded); // Debug

    req.user = {
      _id: decoded._id as string,
      isAdmin: decoded.isAdmin ?? false,
    };
    logger.info("Middleware protect - User:", req.user);
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: "Token expired, please login again",
      });
    } else {
      logger.info("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
};

// Middleware to check if the user is an admin

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logger.info("Middleware isAdmin:", req.user);
  if (req.user && (req.user as { isAdmin: boolean }).isAdmin) {
    next();
  } else {
    res.status(401).json({
      status: false,
      message:
        "Not authorized as admin. Try login as admin. Only admins can perform this action",
    });
  }
};
