import express, { Request, Response, RequestHandler } from "express";
import uploadMiddleware from "../middleware/multer";
import { isAuthenticated } from "../middleware/auth";
import {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  newPasswordValidator,
  updateProfileValidator,
} from "../validator/authValidator";
import {
  registerEmployee,
  loginEmployee,
  updateProfile,
  getEmployee,
  forgetPassword,
  verifyLink,
  mfaVerification,
  newPassword,
  changePassword,
  nextAuth
} from "../controllers/authController";
import { body } from "express-validator";

const router = express.Router();

router.post("/register", registerValidator, registerEmployee);
router.post("/login", loginValidator, loginEmployee);

router.post(
  "/change-password",
  changePasswordValidator,
  isAuthenticated as RequestHandler, changePassword as RequestHandler
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
  isAuthenticated as RequestHandler,
  uploadMiddleware,
  updateProfileValidator,
  updateProfile as RequestHandler
);

router.get("/", isAuthenticated as RequestHandler, getEmployee as RequestHandler);

router.post("/new-password", newPasswordValidator, newPassword);

router.get("/logout", isAuthenticated as RequestHandler, (req: Request, res: Response) => {
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

router.post("/oauth/:provider",nextAuth)

export default router;
