import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import Employee from "../schema/employeeSchema";
import generateToken from "../utils/generateToken";
import extractError, { ValidationError } from "../utils/extractError";
import sendEmail from "../utils/sendEmail";
import removeImage from "../utils/removeImage";
import generateSecureOTP from "../utils/otpGenerate";
import generateCustomId from "../utils/generateCustomId";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
  file?: Express.Multer.File;
}

interface NewPasswordRequest extends Request {
  body: {
    password: string;
    email: string;
  };
}

interface MfaVerificationRequest extends Request {
  body: {
    otp: string;
    email: string;
  };
}

interface JwtPayload {
  otp?: string;
  id?: string;
}


export const registerEmployee = async (req: Request, res: Response): Promise<void> => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    let message = extractError(error.array() as ValidationError[]);
    res.status(422).json({ success: false, message });
    return
  }

  try {
    const { name, email, password } = req.body;
    const isExists = await Employee.findOne({ email });

    if (isExists) {
      res.status(404).json({
        success: false,
        message: { server: "Email already exists" },
      });
      return
    }

    const employeeId = await generateCustomId("Emp", "employeeId");
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await Employee.create({
      name,
      email,
      password: hashPassword,
      employeeId,
    });
    user.password = undefined;

    res.cookie("token", generateToken({ id: (user._id as string) }));
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: { server: error.message || "Server Error" },
    });
  }
};

export const loginEmployee = async (req: Request, res: Response): Promise<void> => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    let message = extractError(error.array() as ValidationError[]);
    res.status(422).json({ success: false, message });
    return
  }

  try {
    const { email, password } = req.body;
    const user = await Employee.findOne({ email });

    if (!user) {
      res.status(404).json({
        success: false,
        message: { server: "User not found" },
      });
      return
    }

    if (!user.password && (user.googleId || user.facebookId)) {
      res.status(400).json({
        success: false,
        message: { server: "Use social login" },
      });
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: { server: "Incorrect password" },
      });
      return
    }

    if (user.mfaEnabled) {
      const otp = generateSecureOTP();
      const token = generateToken({ otp }, "1m");
      user.mfaVerifyToken = token;
      await sendEmail(email, "Your Verification Code", `${otp}`);
      await user.save();

      res.cookie("userId", user._id);
      res.status(200).json({
        success: true,
        mfaRequired: true,
        message: "Two-step authentication required",
        userId: user._id,
      });
      return
    }

    user.password = undefined;
    res.cookie("token", generateToken({ id: (user._id as string) }));
    res.status(200).json({ success: true, user, message: "Successfully logged in" });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: { server: error.message || "Server Error" },
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const error = validationResult(req);
  const newProfilePhoto = req.file?.filename || null;
  let updated = false;

  if (!error.isEmpty()) {
    let message = extractError(error.array() as ValidationError[]);
    res.status(422).json({ success: false, message });
    return
  }

  try {
    const userId = req.user?.role === "admin" ? req.params.id : req.user?.id;
    const existingUser = await Employee.findById(userId).select("-password");
    if (!existingUser) {
      res.status(404).json({ success: false, message: { server: "User not found" } });

      return
    }

    const profileURL = newProfilePhoto
      ? `http://localhost:3001/uploads/${newProfilePhoto}`
      : existingUser.profilePhoto;

    const updatedUser = await Employee.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        socialMedia: JSON.parse(req.body.socialMedia),
        profilePhoto: profileURL,
      },
      { new: true, select: "-password" }
    );

    updated = true;
    res.status(200).json({ message: "Profile updated successfully", user: updatedUser, success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: { server: err.message || "Server error" } });
  } finally {
    if (!updated) removeImage(newProfilePhoto as string);
  }
};

export const getEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await Employee.findById(req.user?.id).select("-password");
    if (!user) {
      res.status(404).json({ success: false, message: "User Not Found" });
      return
    }
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    let message = extractError(error.array() as ValidationError[]);
    res.status(422).json({ success: false, message });
    return
  }

  try {
    const { password, newPassword } = req.body;
    const user = await Employee.findById(req.user?.id);
    if (!user || (!user.password && (user.googleId || user.facebookId))) {
      res.status(400).json({ success: false, message: { server: "Incorrect password" } });
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: { server: "Incorrect password" } });
      return
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

export const forgetPassword = async (req: Request, res: Response): Promise<void> => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    let message = extractError(error.array() as ValidationError[]);
    res.status(422).json({ success: false, message });
    return
  }

  try {
    const { email } = req.body;
    const user = await Employee.findOne({ email }).select("-password");
    if (!user) {
      res.status(404).json({ success: false, message: { server: "User not found" } });
      return
    }

    const token =
      user.resetToken &&
        Date.now() < user.resetTokenExpiry?.getTime()!
        ? user.resetToken
        : generateToken({ email, id: (user._id as string) }, "5m");

    const resetLink = `${process.env.CLIENT_HOST}/verify-link?email=${email}`;

    await sendEmail(email, "Reset Password", `<a href='${resetLink}'>Reset Link</a>`);
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    res.status(200).json({ success: true, message: "Link sent" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

export const verifyLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.query;
    if (!email || typeof email !== "string") {
      res.status(400).json({ success: false, message: { server: "Token is required" } });
      return
    }

    const user = await Employee.findOne({ email });
    if (!user || !user.resetToken) {
      res.status(404).json({ success: false, message: { server: "Token is missing or user not found" } })
      return
    }

    if (Date.now() > user.resetTokenExpiry?.getTime()!) {
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
      res.status(400).json({ success: false, message: { server: "Token has expired" } });
      return
    }

    const isValid = jwt.verify(user.resetToken, process.env.JWT_SECRET!);
    if (!isValid) {
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
      res.status(400).json({ success: false, message: { server: "Invalid token" } });
      return
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

export const newPassword = async (
  req: NewPasswordRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = extractError(errors.array() as ValidationError[]);
    res.status(422).json({ success: false, message });
    return
  }

  const { password, email } = req.body;

  try {
    if (!email) {
      res.status(400).json({
        success: false,
        message: { server: "Token is Required" },
      });
      return
    }

    const user = await Employee.findOne({ email });

    if (!user) {
      res.status(404).json({
        success: false,
        message: { server: "User not Found" },
      });
      return
    }

    if (!user.resetToken) {
      res.status(404).json({
        success: false,
        message: { server: "Token is Missing" },
      });
      return
    }

    if (Date.now() > user?.resetTokenExpiry?.getTime()!) {
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

      res.status(400).json({
        success: false,
        message: { server: "Token has expired" },
      });
      return
    }

    // jwt.verify returns the decoded payload or throws error if invalid
    let isValidToken: JwtPayload;
    try {
      isValidToken = jwt.verify(user.resetToken, process.env.JWT_SECRET!) as JwtPayload;
    } catch {
      res.status(400).json({
        success: false,
        message: { server: "Invalid or expired token" },
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user.password = hashPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Change the Password",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: { server: error.message || "Server Error" },
    });
  }
};

export const mfaVerification = async (
  req: MfaVerificationRequest,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = extractError(errors.array() as ValidationError[]);
    res.status(422).json({ success: false, message });
    return
  }

  const { otp, email } = req.body;
  const user = await Employee.findOne({ email }).select("-password");

  if (!user) {
    res.status(404).json({
      success: false,
      message: { server: "User not found" },
    });
    return
  }

  try {
    const decoded = jwt.verify(user.mfaVerifyToken!, process.env.JWT_SECRET!) as JwtPayload;

    if (decoded.otp === otp) {
      user.mfaVerifyToken = undefined;
      await user.save();

      res.cookie("token", generateToken({ id: (user._id as string).toString() }));

      res.status(200).json({
        success: true,
        message: "success",
      });
      return
    } else {
      res.status(400).json({
        success: false,
        message: { server: "Wrong Otp" },
      });
      return
    }
  } catch (error: any) {
    user.mfaVerifyToken = undefined;
    await user.save();

    res.status(500).json({
      success: false,
      message: { server: error.message || "Token is Expired" },
    });
  }
};
