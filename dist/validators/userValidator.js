"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.password = void 0;
const express_validator_1 = require("express-validator");
const password = (field) => {
    return (0, express_validator_1.body)(field)
        .trim()
        .escape()
        .isString()
        .isLength({ min: 8 })
        .withMessage(`${field === 'password' ? 'Password' : 'Confirm password'} should not be empty and at a minimum eight characters.`)
        .bail()
        .custom((value, { req }) => {
        if (field === 'confirmPassword' && value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    });
};
exports.password = password;
const resetPassword = (field) => {
    return (0, express_validator_1.body)(field)
        .trim()
        .escape()
        .isString()
        .isLength({ min: 8 })
        .withMessage(`${field} should not be empty and at a minimum eight characters.`)
        .bail()
        .custom((value, { req }) => {
        if (field === 'confirmationPassword' &&
            value !== req.body.newPassword) {
            throw new Error('Confirmation password does not match password');
        }
        return true;
    });
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=userValidator.js.map