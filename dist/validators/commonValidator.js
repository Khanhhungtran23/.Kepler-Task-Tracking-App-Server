"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalTextField = exports.requiredTextField = exports.booleanValidator = void 0;
const express_validator_1 = require("express-validator");
const lodash_1 = require("lodash");
const booleanValidator = (field, messageName, options = {
    type: 'body',
    optional: true,
    allow: [],
}) => {
    let validation = null;
    switch (options === null || options === void 0 ? void 0 : options.type) {
        case 'param':
            validation = (0, express_validator_1.param)(field);
            break;
        case 'body':
            validation = (0, express_validator_1.body)(field);
            break;
        case 'query':
            validation = (0, express_validator_1.query)(field);
            break;
    }
    if (options === null || options === void 0 ? void 0 : options.optional) {
        validation.optional({ nullable: true });
    }
    else {
        validation
            .exists()
            .withMessage(`${messageName} must be provided`)
            .bail()
            .notEmpty()
            .withMessage(`${messageName} must be provided`)
            .bail();
    }
    return validation
        .trim()
        .isBoolean()
        .withMessage(`${messageName} should be boolean`)
        .custom((value) => {
        if (!(0, lodash_1.isEmpty)(value)) {
            if (!(options === null || options === void 0 ? void 0 : options.allow.some((v) => v === value))) {
                throw new Error(`${messageName} must be a boolean: [${options === null || options === void 0 ? void 0 : options.allow.join(',')}]`);
            }
            return true;
        }
        return false;
    })
        .customSanitizer((value) => {
        if ((0, lodash_1.isEmpty)(value)) {
            return null;
        }
        return value;
    });
};
exports.booleanValidator = booleanValidator;
const requiredTextField = (field, messageName, options) => {
    return (0, express_validator_1.body)(field)
        .trim()
        .exists()
        .notEmpty()
        .withMessage(`${messageName} is required`)
        .isString()
        .bail()
        .isLength({
        min: options.min,
        max: options.max,
    })
        .withMessage(`${messageName} must be between ${options.min} and ${options.max} characters`);
};
exports.requiredTextField = requiredTextField;
const optionalTextField = (field, messageName, options) => {
    return (0, express_validator_1.body)(field)
        .optional({
        nullable: options.nullable,
    })
        .trim()
        .isString()
        .isLength({
        min: options.min,
        max: options.max,
    })
        .withMessage(`${messageName} must be between ${options.min} and ${options.max} characters`);
};
exports.optionalTextField = optionalTextField;
//# sourceMappingURL=commonValidator.js.map