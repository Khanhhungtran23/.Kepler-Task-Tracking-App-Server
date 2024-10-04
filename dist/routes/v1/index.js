"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const role_route_1 = require("./role.route");
const user_route_1 = require("./user.route");
const auth_route_1 = require("./auth.route");
const _router = (0, express_1.Router)({
    mergeParams: true,
});
_router.use(function (req, res, next) {
    res.setHeader('Api-Version', 'v1');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});
_router.route('/v1/health-check').get(function (req, res) {
    return res.status(200).json({ healthy: true, version: 'v1' });
});
_router.use('/v1/role', role_route_1.router);
_router.use('/v1/user', user_route_1.router);
_router.use('/v1/auth', auth_route_1.router);
exports.router = _router;
//# sourceMappingURL=index.js.map