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
const utils_1 = require("../utils");
const verifyEmailTemplate_1 = __importDefault(require("../templates/verifyEmailTemplate"));
const mailService_1 = __importDefault(require("../services/mailService"));
const enums_1 = require("../utils/enums");
const user_1 = __importDefault(require("../models/user"));
const role_1 = __importDefault(require("../models/role"));
const otpMaster_1 = __importDefault(require("../models/otpMaster"));
const bcrypt_1 = require("bcrypt");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, avatar, email, password } = req.body;
        const userExist = yield user_1.default.exists({ email });
        if (userExist) {
            throw new httpError_1.default({
                title: 'emailAddress',
                detail: 'Email address is already used',
                code: 422,
            });
        }
        const role = yield role_1.default.findOne({ name: enums_1.RoleType.USER });
        if (!role) {
            throw new httpError_1.default({
                title: 'role',
                detail: 'User role not found',
                code: 422,
            });
        }
        const hashPassword = yield (0, bcrypt_1.hash)(password, 12);
        let user = new user_1.default({
            firstName,
            lastName,
            avatar,
            email,
            password: hashPassword,
            role: role._id,
        });
        let savedUser = yield user.save();
        let tokenExpiration = new Date();
        tokenExpiration = tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 10);
        const otp = (0, utils_1.generateOtp)(6);
        let newOtp = new otpMaster_1.default({
            userId: savedUser._id,
            type: enums_1.OtpType.VERIFICATION,
            otp,
            otpExpiration: new Date(tokenExpiration),
        });
        yield newOtp.save();
        const emailTemplate = (0, verifyEmailTemplate_1.default)(otp);
        const mailService = mailService_1.default.getInstance();
        yield mailService.sendMail(req.headers['X-Request-Id'], {
            to: user.email,
            subject: 'Verify OTP',
            html: emailTemplate.html,
        });
        return (0, general_1.jsonOne)(res, 201, savedUser);
    }
    catch (error) {
        next(error);
    }
});
const verifyEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        let user = yield user_1.default.findOne({ email });
        if (!user) {
            throw new httpError_1.default({
                title: 'bad_request',
                detail: 'You have entered an invalid email address.',
                code: 400,
            });
        }
        else if (user.isEmailVerified) {
            return (0, general_1.jsonOne)(res, 200, 'User Email Is Already Verified.');
        }
        let isOtpValid = yield (0, utils_1.verifyOtp)(user._id, otp, enums_1.OtpType.VERIFICATION);
        if (!isOtpValid) {
            throw new httpError_1.default({
                title: 'bad_request',
                detail: 'This OTP has Invalid.',
                code: 400,
            });
        }
        user.isEmailVerified = true;
        user.save();
        yield otpMaster_1.default.findByIdAndDelete(isOtpValid);
        return (0, general_1.jsonOne)(res, 200, 'Email Verification Successfull.');
    }
    catch (error) {
        next(error);
    }
});
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        let data = yield user_1.default.findById(userId).populate('role');
        return (0, general_1.jsonOne)(res, 200, data);
    }
    catch (error) {
        next(error);
    }
});
const getAllUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pageOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
        };
        const count = yield user_1.default.countDocuments({});
        let users = yield user_1.default.find()
            .populate('role')
            .limit(pageOptions.limit * 1)
            .skip((pageOptions.page - 1) * pageOptions.limit)
            .sort({ createdAt: -1 });
        const meta = {
            total: count,
            limit: pageOptions.limit,
            totalPages: Math.ceil(count / pageOptions.limit),
            currentPage: pageOptions.page,
        };
        return (0, general_1.jsonAll)(res, 200, users, meta);
    }
    catch (error) {
        next(error);
    }
});
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const payload = req['tokenPayload'];
        const userId = payload['id'];
        if (userId !== req.params.userId) {
            throw new httpError_1.default({
                title: 'forbidden',
                detail: 'Access Forbidden',
                code: 403,
            });
        }
        let user = yield user_1.default.findById(userId);
        if (!user) {
            throw new httpError_1.default({
                title: 'bad_request',
                detail: 'User Not Found.',
                code: 400,
            });
        }
        let isProfileCompleted = true;
        let savedUser = yield user_1.default.findOneAndUpdate({ _id: userId }, {
            firstName: body.firstName,
            lastName: body.lastName,
            gender: body.gender,
            dateOfBirth: body.dateOfBirth,
            residence: body.residence,
            avatar: body.avatar,
            isProfileCompleted,
        }, { new: true });
        return (0, general_1.jsonOne)(res, 200, savedUser);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    createUser,
    verifyEmail,
    getUser,
    getAllUser,
    updateUser,
};
//# sourceMappingURL=user.controller.js.map