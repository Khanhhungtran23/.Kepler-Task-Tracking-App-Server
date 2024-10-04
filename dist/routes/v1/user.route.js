"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const authValidator_1 = require("../../validators/authValidator");
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const permissionMiddleware_1 = __importDefault(require("../../middlewares/permissionMiddleware"));
const userValidator_1 = require("../../validators/userValidator");
const commonValidator_1 = require("../../validators/commonValidator");
const enums_1 = require("../../utils/enums");
const controllers_1 = require("../../controllers");
const _router = (0, express_1.Router)({
    mergeParams: true,
});
_router
    .route('/sign-up')
    .post((0, validationMiddleware_1.default)([
    (0, authValidator_1.emailAddress)(),
    (0, userValidator_1.password)('password'),
    (0, userValidator_1.password)('confirmPassword'),
]), controllers_1.userController.createUser);
_router
    .route('/verify-email')
    .post((0, validationMiddleware_1.default)([
    (0, authValidator_1.emailAddress)(),
    (0, commonValidator_1.requiredTextField)('otp', 'Otp', { min: 2, max: 255 }),
]), controllers_1.userController.verifyEmail);
_router.route('/update/:userId').patch((0, validationMiddleware_1.default)([
    (0, authValidator_1.authorization)(),
    (0, commonValidator_1.requiredTextField)('firstName', 'FirstName', { min: 2, max: 255 }),
    (0, commonValidator_1.requiredTextField)('lastName', 'LastName', { min: 2, max: 255 }),
    (0, commonValidator_1.requiredTextField)('dateOfBirth', 'Date Of Birth', {
        min: 2,
        max: 255,
    }),
    (0, commonValidator_1.requiredTextField)('residence', 'Residence', { min: 2, max: 255 }),
    (0, commonValidator_1.requiredTextField)('avatar', 'Avatar', { min: 2, max: 255 }),
]), authMiddleware_1.default, (0, permissionMiddleware_1.default)([enums_1.RoleType.ADMIN, enums_1.RoleType.USER]), controllers_1.userController.updateUser);
_router
    .route('/fetch/:userId')
    .get((0, validationMiddleware_1.default)([(0, authValidator_1.authorization)()]), authMiddleware_1.default, (0, permissionMiddleware_1.default)([enums_1.RoleType.ADMIN, enums_1.RoleType.USER]), controllers_1.userController.getUser);
_router
    .route('/fetch')
    .get((0, validationMiddleware_1.default)([(0, authValidator_1.authorization)()]), authMiddleware_1.default, (0, permissionMiddleware_1.default)([enums_1.RoleType.ADMIN, enums_1.RoleType.USER]), controllers_1.userController.getAllUser);
exports.router = _router;
//# sourceMappingURL=user.route.js.map