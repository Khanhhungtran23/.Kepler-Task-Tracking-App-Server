"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const controllers_1 = require("../../controllers");
const authValidator_1 = require("../../validators/authValidator");
const userValidator_1 = require("../../validators/userValidator");
const commonValidator_1 = require("../../validators/commonValidator");
const _router = (0, express_1.Router)({
    mergeParams: true,
});
_router
    .route('/login')
    .post((0, validationMiddleware_1.default)([(0, authValidator_1.emailAddress)(), (0, authValidator_1.loginPassword)()]), controllers_1.authController.login);
_router
    .route('/forgot-password')
    .post((0, validationMiddleware_1.default)([(0, authValidator_1.emailAddress)()]), controllers_1.authController.forgotPassword);
_router
    .route('/verify-otp')
    .post((0, validationMiddleware_1.default)([
    (0, authValidator_1.emailAddress)(),
    (0, commonValidator_1.requiredTextField)('otp', 'Otp', { min: 2, max: 255 }),
]), controllers_1.authController.verifyForgetPassword);
_router
    .route('/reset-password')
    .post((0, validationMiddleware_1.default)([
    (0, userValidator_1.password)('password'),
    (0, userValidator_1.password)('confirmPassword'),
    (0, commonValidator_1.requiredTextField)('otp', 'Otp', { min: 2, max: 255 }),
    (0, authValidator_1.emailAddress)(),
]), controllers_1.authController.resetPassword);
exports.router = _router;
//# sourceMappingURL=auth.route.js.map