import crypto from "crypto";
import { Request, Response } from "express";
import User from "../models/user.model";
import Password from "../models/password.model"; // Password model
import { sendMail } from "../utils/mail";
import logger from "../configs/logger.config";

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "Email not found!" });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log("User Object:", user);
    console.log("Preparing to create Password:", {
      user: user._id,
      resetPasswordToken: resetToken,
      resetPasswordExpire: Date.now() + 15 * 60 * 1000,
    });
    if (!Password) {
      console.error("Password Model is undefined");
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
    // Save token and expiry to the Password model
    await Password.create({
      user: user._id,
      resetPasswordToken: resetToken,
      resetPasswordExpire: Date.now() + 15 * 60 * 1000, // Token expires in 15 minutes
    });

    // Generate reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email with reset link
    await sendMail({
      to: user.email,
      subject: "Password Reset",
      template: "reset-password",
      context: {
        resetLink,
        name: user.user_name,
      },
    });

    // Way 1: use queue
    // emailQueue.process(async (job) => {
    //   const { to, subject, template, context } = job.data;
    //   await sendMail({ to, subject, template, context });
    // });
    

    // Way 2: use promise.all
    // const [user, emailSent] = await Promise.all([
    //   User.findOne({ email }).select("email user_name _id"),
    //   sendMail({ to, subject, template, context }),
    // ]);

    res
      .status(200)
      .json({ message: "Reset password email sent successfully!" });
  } catch (error) {
    logger.error("Error in forgotPassword:", error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Find token in Password model and check expiry
    const passwordReset = await Password.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!passwordReset) {
      res.status(400).json({ message: "Invalid or expired token!" });
      return;
    }

    // Find user by the token and update their password
    const user = await User.findById(passwordReset.user);
    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    // Update the user's password
    user.password = newPassword; // Ensure password is hashed in the User model
    await user.save();

    // Delete the token from the Password model
    await Password.findByIdAndDelete(passwordReset._id);

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    logger.error("Error in resetPassword:", error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};
