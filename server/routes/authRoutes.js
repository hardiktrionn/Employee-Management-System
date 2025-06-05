const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const router = express.Router();
const passport = require("passport");

const uploadMiddleware = require("../middleware/multer");
const {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  newPasswordValidator,
  updateProfileValidator,
} = require("../validator/authValidator");

const {
  registerEmployee,
  loginEmployee,
  updateProfile,
  getEmployee,
  changePassword,
  forgetPassword,
  verifyLink,
  newPassword,
  mfaVerification,
} = require("../controllers/authController");
const generateToken = require("../utils/generateToken");
const { body } = require("express-validator");

router.post("/register", registerValidator, registerEmployee);
router.post("/login", loginValidator, loginEmployee);
router.post(
  "/change-password",
  changePasswordValidator,
  isAuthenticated,
  changePassword
);
router.post(
  "/forget-password",
  body("email")
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("Please Enter Valid Email"),

  forgetPassword
);
router.get("/verify-link", verifyLink);
router.put(
  "/update-profile",
  isAuthenticated,
  uploadMiddleware,
  updateProfileValidator,
  updateProfile
);
router.get("/", isAuthenticated, getEmployee);
router.post("/new-password", newPasswordValidator, newPassword);

router.get("/logout", isAuthenticated, (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

router.post(
  "/mfaVerification",
  body("otp")
    .notEmpty()
    .withMessage("Otp is Required")
    .isNumeric()
    .withMessage("Otp is Numeric"),
  mfaVerification
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const { _id, role } = req.user;
    let token = generateToken({ id: _id, role });
    res.cookie("token", token);
    res.redirect(`${process.env.CLIENT_HOST}/auth/${token}`);
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: `${process.env.CLIENT_HOST}/Login`,
  }),
  (req, res) => {
    const { _id, role } = req.user;
    let token = generateToken({ id: _id, role });
    res.cookie("token", token);
    res.redirect(`${process.env.CLIENT_HOST}/auth/${token}`);
  }
);



module.exports = router;
