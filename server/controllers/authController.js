const Employee = require("../schema/employeeSchema");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const generateToken = require("../utils/generateToken");
const extractError = require("../utils/extractError");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const removeImage = require("../utils/removeImage");
const generateSecureOTP = require("../utils/otpGenerate");

const registerEmployee = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    let message = extractError(error.array());
    return res.status(422).json({ success: false, message });
  }

  try {
    const { name, email, password } = req.body;

    let isExists = await Employee.findOne({ email });

    if (isExists)
      return res.status(404).json({
        success: false,
        message: { server: "Email is Already Exists" },
      });

    let hashPassword = await bcrypt.hash(password, 10);
    let user = await Employee.create({
      name,
      email,
      password: hashPassword,
      employeeId: `Emp-${Date.now()}`,
    });
    user.password = null;
    res.cookie("token", generateToken({ id: user._id, role: user.role }));
    return res.status(200).json({ success: true, user });
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: { server: error.message || "Server Error" },
    });
  }
};
const loginEmployee = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    let message = extractError(error.array());
    return res.status(422).json({ success: false, message });
  }
  try {
    const { email, password } = req.body;

    let user = await Employee.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: { server: "User not Found" } });

    if (!user?.password && user.googleId)
      return res
        .status(400)
        .json({ suceess: false, message: { server: "Use Google login." } });

    if (!user?.password && user.facebookId)
      return res
        .status(400)
        .json({ suceess: false, message: { server: "Use Facebook login." } });

    let isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res
        .status(401)
        .json({ success: false, message: { server: "Incorrect password" } });

    if (user.mfaEnabled) {
      let otp = generateSecureOTP();
      let token = generateToken({ otp }, "1m");
      user.mfaVerifyToken = token;
      await sendEmail(
        email,
        "You Verification Code",
        `
    ${otp}
    `
      );
      await user.save();

      res.cookie("userId", user._id);
      return res.status(200).json({
        success: true,
        mfaRequired: true,
        message: "Two-step authentication required",
        userId: user._id,
      });
    }
    user.password = null;
    res.cookie("token", generateToken({ id: user._id, role: user.role }));
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: { server: error.message || "Server Error" },
    });
  }
};

const updateProfile = async (req, res) => {
  const error = validationResult(req);
  const newProfilePhoto = req.file?.filename || null;
  let updated = false;
  if (!error.isEmpty()) {
    let message = extractError(error.array());
    return res.status(422).json({ success: false, message });
  }
  try {
    let profileURL;
    const userId = req.user.id;
    const {
      name,
      address,
      contact,
      emergencyContact,
      employeeId,
      department,
      designation,
      joiningDate,
      dob,
      mfaEnabled,
      socialMedia,
    } = req.body;

    const updatedUser = await Employee.findById(userId).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: { server: "User not found" } });
    }
    if (newProfilePhoto) {
      profileURL = `http://localhost:3001/uploads/${newProfilePhoto}` || null;
    } else {
      profileURL = updatedUser.profilePhoto;
    }
    let newData = await Employee.findByIdAndUpdate(
      userId,
      {
        name,
        address,
        contact,
        emergencyContact,
        employeeId,
        department,
        designation,
        joiningDate,
        mfaEnabled,
        dob,
        socialMedia: JSON.parse(socialMedia),
        profilePhoto: profileURL,
      },
      { new: true, select: "-password" }
    );
    updated = true;
    return res.status(200).json({
      message: "Profile updated successfully",
      user: newData,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: { server: err.message || "Server error" },
    });
  } finally {
    if (!updated) {
      removeImage(newProfilePhoto);
    }
  }
};
const getEmployee = async (req, res) => {
  try {
    const { id } = req.user;

    let user = await Employee.findById(id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server Error" });
  }
};

const changePassword = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    let message = extractError(error.array());
    return res.status(422).json({ success: false, message });
  }

  try {
    const { id } = req.user;
    const { password, newPassword } = req.body;
    let user = await Employee.findById(id);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: { server: "User not Found." } });

    if ((!user?.password && user.googleId) || user.facebookId)
      return res
        .status(400)
        .json({ suceess: false, message: { server: "Incorrect password." } });

    let isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res
        .status(401)
        .json({ success: false, message: { server: "Incorrect password." } });

    let hashPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashPassword;

    await user.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server Error" });
  }
};

const forgetPassword = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    let message = extractError(error.array());
    return res.status(422).json({ success: false, message });
  }

  try {
    const { email } = req.body;

    let user = await Employee.findOne({ email }).select("-password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: { server: "User not Found" } });

    let token;
    if (user.resetToken && Date.now() < user.resetTokenExpiry) {
      token = user.resetToken;
    } else {
      token = generateToken({ email }, "5m");
    }
    let resetLink = `${process.env.CLIENT_HOST}/verify-link?email=${email}`;

    await sendEmail(
      email,
      "You requested to reset your password",
      `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
  <h2 style="text-align: center; color: #333;">🔗 Password Reset</h2>
  <p style="font-size: 16px; color: #555;">Hello,</p>
  <p style="font-size: 16px; color: #555;">You requested to reset your password. Click the button below to proceed:</p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${resetLink}" style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;" aria-label="Reset your password now">
      Reset Password
    </a>
  </div>
  <p style="font-size: 14px; color: #777;">This link is valid for <strong>5 minutes</strong>. Do not share this link with anyone.</p>
  <p style="font-size: 14px; color: #777;">Or paste this URL into your browser:<br>
    ${resetLink}
  </p>
  <hr style="border: none; border-top: 1px solid #ddd;">
  <p style="text-align: center; font-size: 12px; color: #999;">If you didn’t request this, please ignore this email or contact support.</p>
</div>
    `
    );

    const now = new Date();
    user.resetToken = token;
    user.resetTokenExpiry = new Date(now.getTime() + 5 * 60 * 1000);
    await user.save();
    res.status(200).json({
      success: true,
      message: "Link Sended",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server Error" });
  }
};

const verifyLink = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: { server: "Token is Required" },
      });
    }

    let user = await Employee.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: { server: "User not Found" },
      });
    }

    if (!user.resetToken) {
      return res.status(404).json({
        success: false,
        message: { server: "Token is Missing" },
      });
    }

    if (Date.now() > user.resetTokenExpiry) {
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();

      return res.status(400).json({
        success: false,
        message: { server: "Token has expired" },
      });
    }

    let isValidToken = jwt.verify(user.resetToken, process.env.JWT_SECRET);

    if (!isValidToken) {
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();
      return res.status(400).json({
        success: false,
        message: { server: "Invalid or expired token" },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Token verified",
      email,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: { server: error.message || "Server Error" },
    });
  }
};

const newPassword = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    let message = extractError(error.array());
    return res.status(422).json({ success: false, message });
  }

  const { password, email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: { server: "Token is Required" },
      });
    }

    let user = await Employee.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: { server: "User not Found" },
      });
    }

    if (!user.resetToken) {
      return res.status(404).json({
        success: false,
        message: { server: "Token is Missing" },
      });
    }

    if (Date.now() > user.resetTokenExpiry) {
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();

      return res.status(400).json({
        success: false,
        message: { server: "Token has expired" },
      });
    }

    let isValidToken = jwt.verify(user.resetToken, process.env.JWT_SECRET);

    if (!isValidToken) {
      return res.status(400).json({
        success: false,
        message: { server: "Invalid or expired token" },
      });
    }

    let hashPassword = await bcrypt.hash(password, 10);

    user.password = hashPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Change the Password",
    });
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: { server: error.message || "Server Error" },
    });
  }
};

const mfaVerification = async (req, res) => {
  const { otp, email } = req.body;
  const user = await Employee.findOne({ email }).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: { server: "User not found" },
    });
  }

  try {
    let isValidToken = jwt.verify(user.mfaVerifyToken, process.env.JWT_SECRET);

    if (isValidToken.otp == otp) {
      user.mfaVerifyToken = null;
      await user.save();
      res.cookie("token", generateToken({ id: user._id, role: user.role }));
      return res.status(200).json({
        success: true,
        message: "success",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: { server: "Wrong Otp" },
      });
    }
  } catch (error) {
    user.mfaVerifyToken = null;
    await user.save();
    return res.status(500).json({
      success: false,
      message: { server: error.message || "Token is Expire" },
    });
  }
};
module.exports = {
  registerEmployee,
  loginEmployee,
  updateProfile,
  getEmployee,
  changePassword,
  forgetPassword,
  verifyLink,
  newPassword,
  mfaVerification,
};
