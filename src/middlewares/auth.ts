import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";

// Định nghĩa một giao diện để mở rộng Request với thuộc tính user
interface AuthRequest extends Request {
  user?: {
    _id: string;
    isAdmin: boolean;
  };
}

// Chuyển `protect` thành kiểu `RequestHandler`
export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log("Token from cookie:", token); // Debug
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Token from header:", token); // Debug
  }

  if (!token) {
    console.log("No token provided");
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    console.log("Decoded token:", decoded); // Debug

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      console.log("User not found");
      res.status(404).json({ message: "User not found" });
      return;
    }

    req.user = { _id: user._id as string, isAdmin: user.isAdmin };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token expired, please login again" });
    } else {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
};




// Middleware to check if the user is an admin

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.isAdmin) {
    next(); // Tiếp tục nếu là admin
  } else {
    res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};
