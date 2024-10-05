"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config/config"));
const Logging_1 = __importDefault(require("./library/Logging"));
const index_1 = require("./routes/v1/index");
const httpError_1 = __importDefault(require("./utils/httpError"));
const role_controller_1 = require("./controllers/role.controller");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const router = (0, express_1.default)();
dotenv_1.default.config();
mongoose_1.default.set('strictQuery', true);
mongoose_1.default
    .connect(config_1.default.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
    Logging_1.default.info('Connected to mongoDB.');
    (0, role_controller_1.crateRole)();
    StartServer();
})
    .catch((error) => {
    Logging_1.default.error('Unable to connect to MongoDB.');
    Logging_1.default.error(error);
});
router.use((req, res, next) => {
    Logging_1.default.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        Logging_1.default.info(`Outgoing -> Method: [${req.method}] - Url: [${req.url}] - Status: [${res.statusCode}]`);
    });
    next();
});
router.use((0, cors_1.default)());
router.use(express_1.default.urlencoded({ extended: true }));
router.use(express_1.default.json());
router.use('/api', index_1.router);
router.get('/ping', (req, res) => res.status(200).json({ message: 'pong' }));
router.get('/', (_, res) => {
    res.status(200).json({
        success: true,
        message: 'You are on node-typescript-boilderplate. You should not have further access from here.',
    });
});
router.use((req, res, next) => {
    const error = new Error('not found');
    Logging_1.default.error(error);
    return res.status(404).json({ success: false, message: error.message });
});
router.use((err, req, res, next) => {
    Logging_1.default.error(err.stack);
    if (err instanceof httpError_1.default) {
        return err.sendError(res);
    }
    else {
        return res.status(500).json({
            error: {
                title: 'general_error',
                detail: 'An error occurred, Please retry again later',
                code: 500,
            },
        });
    }
});
const StartServer = () => {
    http_1.default.createServer(router).listen(config_1.default.server.port, () => Logging_1.default.info(`Server is running on port ${config_1.default.server.port}.`));
};
//# sourceMappingURL=index.js.map