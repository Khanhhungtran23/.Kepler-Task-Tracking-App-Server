"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_DB_USER = process.env.MONGO_DB_USER || 'tvkhhung03';
const MONGO_DB_PASSWORD = encodeURIComponent(process.env.MONGO_DB_PASSWORD || '3i3S12iiLQD3v6mH');
const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const MONGO_URL = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@task-management-web-app.nlqtw.mongodb.net/?retryWrites=true&w=majority&appName=Task-management-web-app`;
const config = {
    mongo: {
        url: MONGO_URL,
    },
    server: {
        port: SERVER_PORT,
    },
};
exports.default = config;
//# sourceMappingURL=config.js.map