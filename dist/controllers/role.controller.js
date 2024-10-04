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
exports.crateRole = void 0;
const general_1 = require("../utils/general");
const role_1 = __importDefault(require("../models/role"));
function crateRole() {
    role_1.default.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new role_1.default({
                name: 'user',
            }).save((err) => {
                if (err) {
                    console.log('error', err);
                }
                console.log("added 'user' to roles collection");
            });
            new role_1.default({
                name: 'admin',
            }).save((err) => {
                if (err) {
                    console.log('error', err);
                }
                console.log("added 'admin' to roles collection");
            });
        }
    });
}
exports.crateRole = crateRole;
const getAllRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pageOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
        };
        const count = yield role_1.default.countDocuments({});
        const roles = yield role_1.default.find()
            .limit(pageOptions.limit * 1)
            .skip((pageOptions.page - 1) * pageOptions.limit)
            .sort({ createdAt: -1 });
        const result = {
            roles,
        };
        const meta = {
            total: count,
            limit: pageOptions.limit,
            totalPages: Math.ceil(count / pageOptions.limit),
            currentPage: pageOptions.page,
        };
        return (0, general_1.jsonAll)(res, 201, result, meta);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getAllRole,
};
//# sourceMappingURL=role.controller.js.map