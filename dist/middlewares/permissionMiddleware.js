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
const httpError_1 = __importDefault(require("../utils/httpError"));
const permit = function (allowedRoles) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = req['tokenPayload'];
            if (allowedRoles.includes(payload['role'])) {
                next();
            }
            else {
                next(new httpError_1.default({
                    title: 'forbidden',
                    detail: 'Access Forbidden',
                    code: 403,
                }));
            }
        });
    };
};
exports.default = permit;
//# sourceMappingURL=permissionMiddleware.js.map