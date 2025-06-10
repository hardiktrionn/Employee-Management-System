"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLeave = void 0;
const express_validator_1 = require("express-validator");
exports.registerLeave = [
    (0, express_validator_1.body)("leaveType").notEmpty().withMessage("Leave Type is Required"),
    (0, express_validator_1.body)("startDate").notEmpty().withMessage("Start Date is Required"),
    (0, express_validator_1.body)("endDate").notEmpty().withMessage("End Date is Required"),
    (0, express_validator_1.body)("reason").notEmpty().withMessage("Reason is Required")
];
