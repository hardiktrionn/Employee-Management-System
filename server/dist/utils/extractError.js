"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractError = (error) => {
    const formattedErrors = {};
    error.forEach((err) => {
        if (!formattedErrors[err.path]) {
            formattedErrors[err.path] = err.msg;
        }
    });
    return formattedErrors;
};
exports.default = extractError;
