"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const _router = (0, express_1.Router)({
    mergeParams: true,
});
_router.route('/list').get(controllers_1.roleController.getAllRole);
exports.router = _router;
//# sourceMappingURL=role.route.js.map