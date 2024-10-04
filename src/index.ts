import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import config from './config/config';
import Logging from './library/Logging';
import { router as v1 } from './routes/v1/index';
import MailService from './services/mailService';
import HttpError from './utils/httpError';
import { crateRole } from './controllers/role.controller';
import cors from 'cors';
import dotenv from 'dotenv';

const router = express();
dotenv.config();

// Set strictQuery option
mongoose.set('strictQuery', true);

// CONNECTION TO MONGOOSE DATABASE
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info('Connected to mongoDB.');
        crateRole(); // Assuming this is needed after connection
        StartServer(); // Start the server only after MongoDB is connected
    })
    .catch((error) => {
        Logging.error('Unable to connect to MongoDB.');
        Logging.error(error);
    });

// Middleware for logging requests
router.use((req, res, next) => {
    Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        Logging.info(`Outgoing -> Method: [${req.method}] - Url: [${req.url}] - Status: [${res.statusCode}]`);
    });
    next();
});

// Middleware for CORS and parsing
router.use(cors());
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// API routes with versioning
router.use('/api', v1);

// Health check endpoint
router.get('/ping', (req, res) => res.status(200).json({ message: 'pong' }));

// Root endpoint
router.get('/', (_, res) => {
    res.status(200).json({
        success: true,
        message: 'You are on node-typescript-boilderplate. You should not have further access from here.',
    });
});

// Error handling for 404
router.use((req, res, next) => {
    const error = new Error('not found');
    Logging.error(error);
    return res.status(404).json({ success: false, message: error.message });
});

// Handle errors thrown by controllers
router.use((err: any, req: any, res: any, next: any) => {
    Logging.error(err.stack);
    if (err instanceof HttpError) {
        return err.sendError(res);
    } else {
        return res.status(500).json({
            error: {
                title: 'general_error',
                detail: 'An error occurred, Please retry again later',
                code: 500,
            },
        });
    }
});

// Start server
const StartServer = () => {
    http.createServer(router).listen(config.server.port, () =>
        Logging.info(`Server is running on port ${config.server.port}.`)
    );
};
