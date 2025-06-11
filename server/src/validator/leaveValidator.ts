import { body, ValidationChain } from "express-validator";

// new leave request validation
export const registerLeave: ValidationChain[] = [
    body("leaveType").notEmpty().withMessage("Leave Type is Required"),
    body("startDate").notEmpty().withMessage("Start Date is Required"),
    body("endDate").notEmpty().withMessage("End Date is Required"),
    body("reason").notEmpty().withMessage("Reason is Required")
]