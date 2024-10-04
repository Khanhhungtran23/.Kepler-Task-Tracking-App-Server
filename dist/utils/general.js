"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonOne = exports.jsonAll = void 0;
const jsonAll = function (res, status, data, meta = {}) {
    return res.status(status).json({
        data: data,
        meta: Object.assign({}, meta),
    });
};
exports.jsonAll = jsonAll;
const jsonOne = function (res, status, data) {
    return res.status(status).json({
        data,
    });
};
exports.jsonOne = jsonOne;
//# sourceMappingURL=general.js.map