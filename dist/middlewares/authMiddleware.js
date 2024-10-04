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
const utils_1 = require("../utils");
const httpError_1 = __importDefault(require("../utils/httpError"));
const auth = function (req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            const payload = (0, utils_1.validateToken)(token);
            if (payload['tokenType'] !== 'access') {
                throw new httpError_1.default({
                    title: 'unauthorized',
                    detail: 'Invalid Authorization header',
                    code: 401,
                });
            }
            req['tokenPayload'] = payload;
            next();
        }
        catch (e) {
            if (((_a = e.opts) === null || _a === void 0 ? void 0 : _a.title) === 'invalid_token') {
                next(new httpError_1.default({
                    title: 'unauthorized',
                    detail: 'Invalid Authorization header',
                    code: 401,
                }));
            }
            else {
                next(e);
            }
        }
    });
};
exports.default = auth;
//# sourceMappingURL=authMiddleware.js.map