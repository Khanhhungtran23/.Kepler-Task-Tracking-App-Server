import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import morgan from "morgan";
import router from "../src/routes/index"; 
import { dbConnection } from "./utils/util"; 

dotenv.config();
dbConnection();

const PORT = process.env.PORT || 3000;
const app = express();

// Set up CORS with the correct options
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "DELETE", "PUT","HEAD"],
    credentials: true,
  })
);
app.options('*', cors());  // Enable pre-flight requests for all routes

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Parse cookies
app.use(cookieParser());

// // Logging HTTP requests
app.use(morgan("develop"));

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'You are on Task Tracking Application!!!',
    });
});
// API routes
// app.use("/api", router);

// Start the server
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));