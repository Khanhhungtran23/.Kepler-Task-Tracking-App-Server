"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_DB_USER = process.env.MONGO_DB_USER || '';
const NODE_ENV = process.env.NODE_ENV || '';
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD || '';
const MONGO_URL = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@cluster0.xgqwh.mongodb.net/node_boilerplate-test`;
const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const MONGO_URL_LOCAL = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@cluster0.xgqwh.mongodb.net/node_boilerplate`;
const config = {
    mongo: {
        url: MONGO_URL,
    },
    server: {
        port: SERVER_PORT,
    },
};
if (NODE_ENV === 'production') {
    config.mongo.url = MONGO_URL;
    config.server.port = SERVER_PORT;
}
else if (NODE_ENV === 'local') {
    config.mongo.url = MONGO_URL_LOCAL;
    config.server.port = SERVER_PORT;
}
exports.default = config;
//# sourceMappingURL=config.js.map