const { body } = require("express-validator");

const registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is Required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Name Length Must be 6 to 20 Character long"),
  body("email")
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("Please provide valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 6, max: 40 })
    .withMessage("Password Length Must be 6 to 40 Character long"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Confirm Password are not Matched");
    }
    return true;
  }),
];

const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("Please provide valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 6, max: 40 })
    .withMessage("Password Length Must be 6 to 40 Character long"),
];

const newPasswordValidator = [
  body("password")
    .notEmpty()
    .withMessage("New Password is Required")
    .isLength({ min: 6, max: 40 })
    .withMessage("New Password Length Must be 6 to 40 Character long"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Confirm new Password are not Matched");
    }
    return true;
  }),
];

const changePasswordValidator = [
  body("password")
    .notEmpty()
    .withMessage(" Password is Required")
    .isLength({ min: 6, max: 40 })
    .withMessage("Password Length Must be 6 to 40 Character long"),
  body("newPassword")
    .notEmpty()
    .withMessage("New Password is Required")
    .isLength({ min: 6, max: 40 })
    .withMessage("New Password Length Must be 6 to 40 Character long")
    .custom((value, { req }) => {
      if (value === req.body.password) {
        throw new Error("Password and  New Password Are same");
      }
      return true;
    }),
  body("confirmNewpassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Confirm Password are not Matched");
    }
    return true;
  }),
];

const updateProfileValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email").trim().isEmail().withMessage("Invalid email address"),

  body("contact")
    .trim()
    .notEmpty()
    .withMessage("Contact number is required")
    .isMobilePhone()
    .withMessage("Invalid contact number"),

  body("emergencyContact")
    .trim()
    .notEmpty()
    .withMessage("Emergency Contact number is required")
    .isMobilePhone()
    .withMessage("Invalid emergency contact number")
    .custom((value, { req }) => {
      if (value === req.body.contact) {
        throw new Error("Contact and Emergency Contact are same");
      }
      return true;
    }),

  body("address").trim().notEmpty().withMessage("Address is required"),

  body("designation").trim().notEmpty().withMessage("Designation is required"),

  body("employeeId").trim().notEmpty().withMessage("Employee ID is required"),

  body("department").trim().notEmpty().withMessage("Department is required"),

  body("joiningDate")
    .notEmpty()
    .withMessage("Joining Date is required")
    .isISO8601()
    .withMessage("Invalid date format for Joining Date"),

  body("dob")
    .notEmpty()
    .withMessage("Date of Birth is required")
    .isISO8601()
    .withMessage("Invalid date format for DOB"),
];

module.exports = {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  newPasswordValidator,
  updateProfileValidator,
};
