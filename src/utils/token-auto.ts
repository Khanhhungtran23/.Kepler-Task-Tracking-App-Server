import mongoose from "mongoose";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../configs/logger.config";

dotenv.config();

const generatePermanentTokens = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    const jwtSecret = process.env.JWT_SECRET;

    if (!mongoURI || !jwtSecret) {
      throw new Error("MongoDB URI not found in environment variables.");
    }

    await mongoose.connect(mongoURI);
    logger.info("Mongo Database connection established succesfully!");

    const admin = await User.findOne({ email: "dev@gmail.com" });
    if (!admin) {
      throw new Error("Not found admin account with email: dev@gmail.com");
    }

    const user = await User.findOne({ email: "tester@gmail.com" });
    if (!user) {
      throw new Error("Not found user account with email: tester@gmail.com");
    }

    const adminToken = jwt.sign({ _id: admin._id, isAdmin: true }, jwtSecret, {
      algorithm: "HS256",
    });

    const userToken = jwt.sign({ _id: user._id, isAdmin: false }, jwtSecret, {
      algorithm: "HS256",
    });

    logger.info("Pernament token for admin:", adminToken);
    logger.info("Pernament token for user:", userToken);

    await mongoose.connection.close();
    logger.info("Closed connection to MongoDB.");
  } catch (error) {
    logger.info("Error when token created:", error);
    process.exit(1);
  }
};
// function call
generatePermanentTokens();
