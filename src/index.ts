import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import morgan from "morgan";
import routes from "./routes/index"; 
import { dbConnection } from "./utils/util"; 
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerOptions from "./swagger/swagger.config";
import { routeNotFound, errorHandler } from './middlewares/error';
import { Server } from "socket.io"; // Import Socket.IO
import { setupWebSocket } from "./utils/socket"; // Import hàm setupWebSocket

// db connection
dotenv.config();
dbConnection();

// initialize app
const PORT = process.env.PORT || 8080;
const app = express();

// // Create HTTP server and integrate it with Express
// const server = http.createServer(app);

// // Initialize Socket.IO and attach it to the server
// const io = new Server(server, {
//   cors: {
//     origin: (origin, callback) => {
//       const allowedOrigins = [
//         /^http:\/\/localhost:\d+$/,  // Allow any localhost port
//         /^https:\/\/dotkepler\.vercel\.app$/,
//         /^https:\/\/task-tracking-application-diw35wak6-vo-minh-khangs-projects\.vercel\.app$/
//       ];

//       if (!origin || allowedOrigins.some(regex => regex.test(origin))) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: ["GET", "POST", "DELETE", "PUT", "HEAD"],
//     credentials: true,
//   }
// });

// // Call the function to set up WebSocket events
// setupWebSocket(io);

// Set up CORS with the correct options
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        /^http:\/\/localhost:\d+$/,  // Allow any localhost port
        /^https:\/\/dotkepler\.vercel\.app$/,
        /^https:\/\/task-tracking-application-diw35wak6-vo-minh-khangs-projects\.vercel\.app$/
      ];

      if (!origin || allowedOrigins.some(regex => regex.test(origin))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT", "HEAD"],
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

// Logging HTTP requests
// Configure Morgan for logging
const logFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(logFormat));

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'You are on Task Tracking Application!!!',
    });
});


app.use("/api", routes);

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Route not found handler
app.use(routeNotFound);

// General error handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));