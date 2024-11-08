import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import morgan from "morgan";
import routes from "../src/routes/index"; 
import { dbConnection } from "./utils/util"; 
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerOptions from "./swagger/swagger.config";
import { routeNotFound, errorHandler } from './middlewares/error';

// db connection
dotenv.config();
dbConnection();

// initialize app
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
app.use(bodyParser.json());

// // Parse cookies
app.use(cookieParser());

// // Logging HTTP requests
// app.use(morgan("develop"));

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'You are on Task Tracking Application!!!',
    });
});

// API routes handling
// Route not found handler
//app.use(routeNotFound);

// General error handler
//app.use(errorHandler);

app.use("/api", routes);

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start the server
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));