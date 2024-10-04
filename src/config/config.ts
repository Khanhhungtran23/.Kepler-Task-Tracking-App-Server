import dotenv from 'dotenv';

dotenv.config();

// Declare all variables
const MONGO_DB_USER = process.env.MONGO_DB_USER || 'tvkhhung03';
const MONGO_DB_PASSWORD = encodeURIComponent(process.env.MONGO_DB_PASSWORD || '3i3S12iiLQD3v6mH');
const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

// Construct the MongoDB URL with the user and password
const MONGO_URL = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@task-management-web-app.nlqtw.mongodb.net/?retryWrites=true&w=majority&appName=Task-management-web-app`;

// Create config object
const config = {
    mongo: {
        url: MONGO_URL,
    },
    server: {
        port: SERVER_PORT,
    },
};

// Export config
export default config;
