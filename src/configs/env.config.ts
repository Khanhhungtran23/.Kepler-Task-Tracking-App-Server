import dotenv from "dotenv";

dotenv.config();

export const envConfig = {
  NAME: ".Kepler Backend Server",
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 8080,
  FRONTEND_URL: process.env.FRONTEND_URL,
  SESSION_SECRET: process.env.SESSION_SECRET as string,

  // Nodemailer (Email Service)
  NODEMAILER_USER: process.env.NODEMAILER_USER || "louistran233@gmail.com",
  NODEMAILER_PASS: process.env.NODEMAILER_PASS,
  NODEMAILER_DEFAULT_SENDER:
    process.env.NODEMAILER_DEFAULT_USER || "louistran233@gmail.com",
  NODEMAILER_DEFAULT_RECEIVER: "louistran233@gmail.com",

  // Google OAuth 2.0
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GOOGLE_DIRECT_URL:
    process.env.GOOGLE_DIRECT_URL ||
    "http://localhost:8080/api/auth/google/callback",

  // Facebook Auth
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || "",
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET || "",
  FACEBOOK_DIRECT_URL:
    process.env.FACEBOOK_DIRECT_URL ||
    "http://localhost:8080/api/auth/facebook/callback",
};
