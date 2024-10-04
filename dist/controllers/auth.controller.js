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
const general_1 = require("../utils/general");
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const utils_1 = require("../utils");
const resetPasswordTemplate_1 = __importDefault(require("../templates/resetPasswordTemplate"));
const mailService_1 = __importDefault(require("../services/mailService"));
const utils_2 = require("../utils");
const otpMaster_1 = __importDefault(require("../models/otpMaster"));
const enums_1 = require("../utils/enums");
const bcrypt_1 = require("bcrypt");
const tokenBuilder = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const accessToken = (0, utils_1.generateJWT)({
        id: user._id,
        role: (_a = user.role) === null || _a === void 0 ? void 0 : _a.name,
        tokenType: 'access',
    }, {
        issuer: user.email,
        subject: user.email,
        audience: 'root',
    });
    return {
        accessToken: accessToken,
    };
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let bodyData = (0, express_validator_1.matchedData)(req, {
            includeOptionals: true,
            locations: ['body'],
        });
        const { email, password } = bodyData;
        let user = yield user_1.default.findOne({ email }).populate('role');
        const isValidPass = yield (0, bcrypt_1.compare)(password, user.password);
        if (!user.isEmailVerified) {
            throw new httpError_1.default({
                title: 'bad_request',
                detail: 'Please confirm your account by confirmation email OTP and try again',
                code: 400,
            });
        }
        else if (!user || !isValidPass) {
            throw new httpError_1.default({
                title: 'bad_login',
                detail: 'You have entered an invalid email address or password',
                code: 400,
            });
        }
        const token = yield tokenBuilder(user);
        const response = {
            user,
            accessToken: token.accessToken,
        };
        return (0, general_1.jsonOne)(res, 200, response);
    }
    catch (error) {
        next(error);
    }
});
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const user = yield user_1.default.findOne({ email }).populate('role');
        if (!user.isEmailVerified) {
            throw new httpError_1.default({
                title: 'bad_request',
                detail: 'Please confirm your account by confirmation email OTP and try again',
                code: 400,
            });
        }
        else if (!user) {
            throw new httpError_1.default({
                title: 'bad_login',
                detail: 'You have entered an invalid email address or password',
                code: 400,
            });
        }
        let tokenExpiration = new Date();
        tokenExpiration = tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 10);
        const otp = (0, utils_2.generateOtp)(6);
        let newOtp = new otpMaster_1.default({
            userId: user._id,
            type: enums_1.OtpType.FORGET,
            otp,
            otpExpiration: new Date(tokenExpiration),
        });
        yield newOtp.save();
        const emailTemplate = (0, resetPasswordTemplate_1.default)(otp, user.firstName);
        const mailService = mailService_1.default.getInstance();
        yield mailService.sendMail(req.headers['X-Request-Id'], {
            to: email,
            subject: 'Reset Password',
            html: emailTemplate.html,
        });
        return (0, general_1.jsonOne)(res, 200, 'Forget Password OTP sent successfully');
    }
    catch (e) {
        next(e);
    }
});
const verifyForgetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        let user = yield user_1.default.findOne({ email }).populate('role');
        if (!user) {
            throw new httpError_1.default({
                title: 'bad_request',
                detail: 'You have entered an invalid email address.',
                code: 400,
            });
        }
        let isOtpValid = yield (0, utils_2.verifyOtp)(user._id, otp, enums_1.OtpType.FORGET);
        if (!isOtpValid) {
            throw new httpError_1.default({
                title: 'bad_request',
                detail: 'This OTP has expired.',
                code: 400,
            });
        }
        return (0, general_1.jsonOne)(res, 200, 'Able to reset the password');
    }
    catch (e) {
        next(e);
    }
});
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, password } = req.body;
        let user = yield user_1.default.findOne({ email });
        if (!user) {
            throw new httpError_1.default({
                title: 'bad_request',
                detail: 'You have entered an invalid email address.',
                code: 400,
            });
        }
        let isOtpValid = yield (0, utils_2.verifyOtp)(user._id, otp, enums_1.OtpType.FORGET);
        if (!isOtpValid) {
            throw new httpError_1.default({
                title: 'bad_request',
                detail: 'This OTP has Invalid.',
                code: 400,
            });
        }
        const hashPassword = yield (0, bcrypt_1.hash)(password, 12);
        user.password = hashPassword;
        yield user.save();
        yield otpMaster_1.default.findByIdAndDelete(isOtpValid);
        return (0, general_1.jsonOne)(res, 200, 'Password updated successfully');
    }
    catch (e) {
        next(e);
    }
});
exports.default = {
    login,
    forgotPassword,
    verifyForgetPassword,
    resetPassword,
};
//# sourceMappingURL=auth.controller.js.map