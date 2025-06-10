"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileValidator = exports.changePasswordValidator = exports.newPasswordValidator = exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidator = [
    (0, express_validator_1.body)("name")
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 6, max: 20 }).withMessage("Name length must be 6 to 20 characters"),
    (0, express_validator_1.body)("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email"),
    (0, express_validator_1.body)("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6, max: 40 }).withMessage("Password length must be 6 to 40 characters"),
    (0, express_validator_1.body)("confirmPassword")
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Confirm Password does not match Password");
        }
        return true;
    }),
];
exports.loginValidator = [
    (0, express_validator_1.body)("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email"),
    (0, express_validator_1.body)("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6, max: 40 }).withMessage("Password length must be 6 to 40 characters"),
];
exports.newPasswordValidator = [
    (0, express_validator_1.body)("password")
        .notEmpty().withMessage("New Password is required")
        .isLength({ min: 6, max: 40 }).withMessage("New Password length must be 6 to 40 characters"),
    (0, express_validator_1.body)("confirmPassword")
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Confirm new Password does not match");
        }
        return true;
    }),
];
exports.changePasswordValidator = [
    (0, express_validator_1.body)("password")
        .notEmpty().withMessage("Current Password is required")
        .isLength({ min: 6, max: 40 }).withMessage("Password length must be 6 to 40 characters"),
    (0, express_validator_1.body)("newPassword")
        .notEmpty().withMessage("New Password is required")
        .isLength({ min: 6, max: 40 }).withMessage("New Password length must be 6 to 40 characters")
        .custom((value, { req }) => {
        if (value === req.body.password) {
            throw new Error("New Password must be different from Current Password");
        }
        return true;
    }),
    (0, express_validator_1.body)("confirmNewPassword")
        .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error("Confirm Password does not match New Password");
        }
        return true;
    }),
];
exports.updateProfileValidator = [
    (0, express_validator_1.body)("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    (0, express_validator_1.body)("email")
        .trim()
        .isEmail().withMessage("Invalid email address"),
    (0, express_validator_1.body)("contact")
        .trim()
        .notEmpty().withMessage("Contact number is required")
        .isMobilePhone("en-IN").withMessage("Invalid contact number"),
    (0, express_validator_1.body)("emergencyContact")
        .trim()
        .notEmpty().withMessage("Emergency Contact number is required")
        .isMobilePhone("en-IN").withMessage("Invalid emergency contact number")
        .custom((value, { req }) => {
        if (value === req.body.contact) {
            throw new Error("Contact and Emergency Contact cannot be the same");
        }
        return true;
    }),
    (0, express_validator_1.body)("address")
        .trim()
        .notEmpty().withMessage("Address is required"),
    (0, express_validator_1.body)("designation")
        .trim()
        .notEmpty().withMessage("Designation is required"),
    (0, express_validator_1.body)("employeeId")
        .trim()
        .notEmpty().withMessage("Employee ID is required"),
    (0, express_validator_1.body)("department")
        .trim()
        .notEmpty().withMessage("Department is required"),
    (0, express_validator_1.body)("joiningDate")
        .notEmpty().withMessage("Joining Date is required")
        .isISO8601().withMessage("Invalid date format for Joining Date"),
    (0, express_validator_1.body)("dob")
        .notEmpty().withMessage("Date of Birth is required")
        .isISO8601().withMessage("Invalid date format for DOB"),
];
