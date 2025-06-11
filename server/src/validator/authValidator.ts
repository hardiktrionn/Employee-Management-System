import { body, ValidationChain } from "express-validator";

// employee registeration validation
export const registerValidator: ValidationChain[] = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 6, max: 20 }).withMessage("Name length must be 6 to 20 characters"),
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6, max: 40 }).withMessage("Password length must be 6 to 40 characters"),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm Password does not match Password");
      }
      return true;
    }),
];

// employee login validation
export const loginValidator: ValidationChain[] = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6, max: 40 }).withMessage("Password length must be 6 to 40 characters"),
];

// employee new password validation
export const newPasswordValidator: ValidationChain[] = [
  body("password")
    .notEmpty().withMessage("New Password is required")
    .isLength({ min: 6, max: 40 }).withMessage("New Password length must be 6 to 40 characters"),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm new Password does not match");
      }
      return true;
    }),
];

// employee change-password validation
export const changePasswordValidator: ValidationChain[] = [
  body("password")
    .notEmpty().withMessage("Current Password is required")
    .isLength({ min: 6, max: 40 }).withMessage("Password length must be 6 to 40 characters"),
  body("newPassword")
    .notEmpty().withMessage("New Password is required")
    .isLength({ min: 6, max: 40 }).withMessage("New Password length must be 6 to 40 characters")
    .custom((value, { req }) => {
      if (value === req.body.password) {
        throw new Error("New Password must be different from Current Password");
      }
      return true;
    }),
  body("confirmNewPassword")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Confirm Password does not match New Password");
      }
      return true;
    }),
];

// employee Update profile validation
export const updateProfileValidator: ValidationChain[] = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),

  body("email")
    .trim()
    .isEmail().withMessage("Invalid email address"),

  body("contact")
    .trim()
    .notEmpty().withMessage("Contact number is required")
    .isMobilePhone("en-IN").withMessage("Invalid contact number"),

  body("emergencyContact")
    .trim()
    .notEmpty().withMessage("Emergency Contact number is required")
    .isMobilePhone("en-IN").withMessage("Invalid emergency contact number")
    .custom((value, { req }) => {
      if (value === req.body.contact) {
        throw new Error("Contact and Emergency Contact cannot be the same");
      }
      return true;
    }),

  body("address")
    .trim()
    .notEmpty().withMessage("Address is required"),

  body("designation")
    .trim()
    .notEmpty().withMessage("Designation is required"),

  body("employeeId")
    .trim()
    .notEmpty().withMessage("Employee ID is required"),

  body("department")
    .trim()
    .notEmpty().withMessage("Department is required"),

  body("joiningDate")
    .notEmpty().withMessage("Joining Date is required")
    .isISO8601().withMessage("Invalid date format for Joining Date"),

  body("dob")
    .notEmpty().withMessage("Date of Birth is required")
    .isISO8601().withMessage("Invalid date format for DOB"),
];
