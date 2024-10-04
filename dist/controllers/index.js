"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleController = exports.authController = exports.userController = void 0;
const user_controller_1 = __importDefault(require("./user.controller"));
exports.userController = user_controller_1.default;
const auth_controller_1 = __importDefault(require("./auth.controller"));
exports.authController = auth_controller_1.default;
const role_controller_1 = __importDefault(require("./role.controller"));
exports.roleController = role_controller_1.default;
//# sourceMappingURL=index.js.map