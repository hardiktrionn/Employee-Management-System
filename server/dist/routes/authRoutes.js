"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const multer_1 = __importDefault(require("../middleware/multer"));
const auth_1 = require("../middleware/auth");
const authValidator_1 = require("../validator/authValidator");
const authController_1 = require("../controllers/authController");
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post("/register", authValidator_1.registerValidator, authController_1.registerEmployee);
router.post("/login", authValidator_1.loginValidator, authController_1.loginEmployee);
router.post("/change-password", authValidator_1.changePasswordValidator, auth_1.isAuthenticated, authController_1.changePassword);
router.post("/forget-password", (0, express_validator_1.body)("email")
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("Please Enter Valid Email"), authController_1.forgetPassword);
router.get("/verify-link", authController_1.verifyLink);
router.put("/update-profile", auth_1.isAuthenticated, multer_1.default, authValidator_1.updateProfileValidator, authController_1.updateProfile);
router.get("/", auth_1.isAuthenticated, authController_1.getEmployee);
router.post("/new-password", authValidator_1.newPasswordValidator, authController_1.newPassword);
router.get("/logout", auth_1.isAuthenticated, (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
});
router.post("/mfaVerification", (0, express_validator_1.body)("otp")
    .notEmpty()
    .withMessage("Otp is Required")
    .isNumeric()
    .withMessage("Otp is Numeric"), authController_1.mfaVerification);
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    const { _id, role } = req.user;
    const token = (0, generateToken_1.default)({ id: _id, role });
    res.cookie("token", token);
    res.redirect(`${process.env.CLIENT_HOST}/auth/${token}`);
});
router.get("/facebook", passport_1.default.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback", passport_1.default.authenticate("facebook", {
    failureRedirect: `${process.env.CLIENT_HOST}/Login`,
}), (req, res) => {
    const { _id, role } = req.user;
    const token = (0, generateToken_1.default)({ id: _id, role });
    res.cookie("token", token);
    res.redirect(`${process.env.CLIENT_HOST}/auth/${token}`);
});
exports.default = router;
