"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginPassword = exports.emailAddress = exports.authorization = void 0;
const express_validator_1 = require("express-validator");
const utils_1 = require("../utils");
const authorization = () => {
    return (0, express_validator_1.header)('authorization')
        .trim()
        .escape()
        .exists()
        .notEmpty()
        .withMessage('Missing authentication header')
        .bail()
        .customSanitizer((token, { location }) => {
        if (location === 'headers') {
            return (0, utils_1.extractToken)(token);
        }
    })
        .isJWT()
        .withMessage('Invalid Authorization header, must be Bearer authorization');
};
exports.authorization = authorization;
const emailAddress = () => {
    return (0, express_validator_1.body)('email')
        .trim()
        .escape()
        .exists()
        .notEmpty()
        .withMessage('Email address is required')
        .bail()
        .isLength({
        min: 3,
        max: 100,
    })
        .withMessage('Email address must be between 3 and 100 characters')
        .bail()
        .isEmail()
        .withMessage('Email address is not valid')
        .customSanitizer((email) => {
        return email.toLowerCase();
    });
};
exports.emailAddress = emailAddress;
const loginPassword = () => {
    return (0, express_validator_1.body)('password')
        .trim()
        .escape()
        .exists()
        .notEmpty()
        .isString()
        .isLength({
        max: 255,
    })
        .withMessage('Password is not valid');
};
exports.loginPassword = loginPassword;
//# sourceMappingURL=authValidator.js.map