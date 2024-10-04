"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const mailService_1 = __importDefault(require("./services/mailService"));
const httpError_1 = __importDefault(require("./utils/httpError"));
const role_controller_1 = require("./controllers/role.controller");
const router = (0, express_1.default)();
mongoose_1.default
    .connect(config_1.default.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
    Logging_1.default.info(`Running on ENV = ${process.env.NODE_ENV}`);
    Logging_1.default.info('Connected to mongoDB.');
    StartServer();
    (0, role_controller_1.crateRole)();
})
    .catch((error) => {
    Logging_1.default.error('Unable to connect.');
    Logging_1.default.error(error);
});
const StartServer = () => __awaiter(void 0, void 0, void 0, function* () {
    Logging_1.default.info('Connecting with SMTP Server...');
    const mailService = mailService_1.default.getInstance();
    if (process.env.NODE_ENV === 'local') {
        yield mailService.createLocalConnection();
    }
    else if (process.env.NODE_ENV === 'production') {
        yield mailService.createConnection();
    }
    Logging_1.default.info('SMTP Server Connected');
    Logging_1.default.info('SMTP Connection verified');
    router.use((req, res, next) => {
        Logging_1.default.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
        res.on('finish', () => {
            Logging_1.default.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}] IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });
        next();
    });
    router.use(express_1.default.urlencoded({ extended: true }));
    router.use(express_1.default.json());
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-with,Content-Type,Accept,Authorization');
        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
            return res.status(200).json({});
        }
        next();
    });
    router.use('/api', index_1.router);
    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));
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
    router.use(function (err, req, res, next) {
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
    http_1.default.createServer(router).listen(config_1.default.server.port, () => Logging_1.default.info(`Server is running on port ${config_1.default.server.port}.`));
});
//# sourceMappingURL=index.js.map