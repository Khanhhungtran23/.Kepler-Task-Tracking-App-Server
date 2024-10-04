"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpType = exports.AccountStatus = exports.RoleType = void 0;
var RoleType;
(function (RoleType) {
    RoleType["USER"] = "user";
    RoleType["ADMIN"] = "admin";
})(RoleType = exports.RoleType || (exports.RoleType = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["Active"] = "activate";
    AccountStatus["DEACTIVE"] = "deactivate";
})(AccountStatus = exports.AccountStatus || (exports.AccountStatus = {}));
var OtpType;
(function (OtpType) {
    OtpType["FORGET"] = "forget";
    OtpType["VERIFICATION"] = "verification";
})(OtpType = exports.OtpType || (exports.OtpType = {}));
//# sourceMappingURL=index.js.map