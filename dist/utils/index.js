"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.verifyOtp = exports.generateOtp = exports.generateRandomPassword = exports.extractToken = exports.validateForgotPasswordJWT = exports.validateToken = exports.generateForgotPasswordJWT = exports.generateJWT = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const otpMaster_1 = __importDefault(require("../models/otpMaster"));
const httpError_1 = __importDefault(require("./httpError"));
const generateJWT = function (payload = {}, options = {}) {
    const privateKey = process.env.JWT_SECRETS;
    const defaultOptions = {
        expiresIn: '1h',
    };
    return jwt.sign(payload, privateKey, Object.assign(defaultOptions, options));
};
exports.generateJWT = generateJWT;
const generateForgotPasswordJWT = function (password, payload = {}, options = {}) {
    const privateKey = process.env.JWT_SECRETS + password;
    const defaultOptions = {
        expiresIn: '1h',
    };
    return jwt.sign(payload, privateKey, Object.assign(defaultOptions, options));
};
exports.generateForgotPasswordJWT = generateForgotPasswordJWT;
const validateToken = function (token) {
    try {
        const publicKey = process.env.JWT_SECRETS;
        return jwt.verify(token, publicKey);
    }
    catch (e) {
        throw new httpError_1.default({
            title: 'invalid_token',
            detail: 'Invalid token',
            code: 400,
        });
    }
};
exports.validateToken = validateToken;
const validateForgotPasswordJWT = function (password, token) {
    try {
        const publicKey = process.env.JWT_SECRETS + password;
        return jwt.verify(token, publicKey);
    }
    catch (e) {
        throw new httpError_1.default({
            title: 'invalid_token',
            detail: 'Password reset link was expired',
            code: 400,
        });
    }
};
exports.validateForgotPasswordJWT = validateForgotPasswordJWT;
const extractToken = function (token) {
    if (token === null || token === void 0 ? void 0 : token.startsWith('Bearer ')) {
        return token.slice(7, token.length);
    }
    return null;
};
exports.extractToken = extractToken;
const generateRandomPassword = function (len) {
    const randomString = 'abcdefghijklmnopqrstuvwxyzBCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let index = 0; index < len; index++) {
        password +=
            randomString[Math.ceil(Math.random() * (randomString.length - 1))];
    }
    return password;
};
exports.generateRandomPassword = generateRandomPassword;
const generateOtp = function (len) {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < len; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};
exports.generateOtp = generateOtp;
const verifyOtp = function (userId, otp, type) {
    return __awaiter(this, void 0, void 0, function* () {
        let existOtp = yield otpMaster_1.default.findOne({
            userId,
            otp,
            type,
        });
        const currentDate = new Date();
        if (!existOtp || existOtp.otpExpiration < currentDate) {
            return null;
        }
        return existOtp._id;
    });
};
exports.verifyOtp = verifyOtp;
//# sourceMappingURL=index.js.map