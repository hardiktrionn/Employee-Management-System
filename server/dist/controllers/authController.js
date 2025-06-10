"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mfaVerification = exports.newPassword = exports.verifyLink = exports.forgetPassword = exports.changePassword = exports.getEmployee = exports.updateProfile = exports.loginEmployee = exports.registerEmployee = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const employeeSchema_1 = __importDefault(require("../schema/employeeSchema"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const extractError_1 = __importDefault(require("../utils/extractError"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const removeImage_1 = __importDefault(require("../utils/removeImage"));
const otpGenerate_1 = __importDefault(require("../utils/otpGenerate"));
const generateCustomId_1 = __importDefault(require("../utils/generateCustomId"));
const registerEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        let message = (0, extractError_1.default)(error.array());
        res.status(422).json({ success: false, message });
        return;
    }
    try {
        const { name, email, password } = req.body;
        const isExists = yield employeeSchema_1.default.findOne({ email });
        if (isExists) {
            res.status(404).json({
                success: false,
                message: { server: "Email already exists" },
            });
            return;
        }
        const employeeId = yield (0, generateCustomId_1.default)("Emp", "employeeId");
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield employeeSchema_1.default.create({
            name,
            email,
            password: hashPassword,
            employeeId,
        });
        user.password = undefined;
        res.cookie("token", (0, generateToken_1.default)({ id: user._id, role: user.role }));
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: { server: error.message || "Server Error" },
        });
    }
});
exports.registerEmployee = registerEmployee;
const loginEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        let message = (0, extractError_1.default)(error.array());
        res.status(422).json({ success: false, message });
        return;
    }
    try {
        const { email, password } = req.body;
        const user = yield employeeSchema_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                message: { server: "User not found" },
            });
            return;
        }
        if (!user.password && (user.googleId || user.facebookId)) {
            res.status(400).json({
                success: false,
                message: { server: "Use social login" },
            });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: { server: "Incorrect password" },
            });
            return;
        }
        if (user.mfaEnabled) {
            const otp = (0, otpGenerate_1.default)();
            const token = (0, generateToken_1.default)({ otp }, "1m");
            user.mfaVerifyToken = token;
            yield (0, sendEmail_1.default)(email, "Your Verification Code", `${otp}`);
            yield user.save();
            res.cookie("userId", user._id);
            res.status(200).json({
                success: true,
                mfaRequired: true,
                message: "Two-step authentication required",
                userId: user._id,
            });
            return;
        }
        user.password = undefined;
        res.cookie("token", (0, generateToken_1.default)({ id: user._id, role: user.role }));
        res.status(200).json({ success: true, user, message: "Successfully logged in" });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: { server: error.message || "Server Error" },
        });
    }
});
exports.loginEmployee = loginEmployee;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const error = (0, express_validator_1.validationResult)(req);
    const newProfilePhoto = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || null;
    let updated = false;
    if (!error.isEmpty()) {
        let message = (0, extractError_1.default)(error.array());
        res.status(422).json({ success: false, message });
        return;
    }
    try {
        const userId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === "admin" ? req.params.id : (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
        const existingUser = yield employeeSchema_1.default.findById(userId).select("-password");
        if (!existingUser) {
            res.status(404).json({ success: false, message: { server: "User not found" } });
            return;
        }
        const profileURL = newProfilePhoto
            ? `http://localhost:3001/uploads/${newProfilePhoto}`
            : existingUser.profilePhoto;
        const updatedUser = yield employeeSchema_1.default.findByIdAndUpdate(userId, Object.assign(Object.assign({}, req.body), { socialMedia: JSON.parse(req.body.socialMedia), profilePhoto: profileURL }), { new: true, select: "-password" });
        updated = true;
        res.status(200).json({ message: "Profile updated successfully", user: updatedUser, success: true });
    }
    catch (err) {
        res.status(500).json({ success: false, message: { server: err.message || "Server error" } });
    }
    finally {
        if (!updated)
            (0, removeImage_1.default)(newProfilePhoto);
    }
});
exports.updateProfile = updateProfile;
const getEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield employeeSchema_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).select("-password");
        if (!user) {
            res.status(404).json({ success: false, message: "User Not Found" });
            return;
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
});
exports.getEmployee = getEmployee;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        let message = (0, extractError_1.default)(error.array());
        res.status(422).json({ success: false, message });
        return;
    }
    try {
        const { password, newPassword } = req.body;
        const user = yield employeeSchema_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!user || (!user.password && (user.googleId || user.facebookId))) {
            res.status(400).json({ success: false, message: { server: "Incorrect password" } });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ success: false, message: { server: "Incorrect password" } });
            return;
        }
        user.password = yield bcrypt_1.default.hash(newPassword, 10);
        yield user.save();
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
});
exports.changePassword = changePassword;
const forgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        let message = (0, extractError_1.default)(error.array());
        res.status(422).json({ success: false, message });
        return;
    }
    try {
        const { email } = req.body;
        const user = yield employeeSchema_1.default.findOne({ email }).select("-password");
        if (!user) {
            res.status(404).json({ success: false, message: { server: "User not found" } });
            return;
        }
        const token = user.resetToken &&
            Date.now() < ((_a = user.resetTokenExpiry) === null || _a === void 0 ? void 0 : _a.getTime())
            ? user.resetToken
            : (0, generateToken_1.default)({ email, id: user._id, role: user.role }, "5m");
        const resetLink = `${process.env.CLIENT_HOST}/verify-link?email=${email}`;
        yield (0, sendEmail_1.default)(email, "Reset Password", `<a href='${resetLink}'>Reset Link</a>`);
        user.resetToken = token;
        user.resetTokenExpiry = new Date(Date.now() + 5 * 60 * 1000);
        yield user.save();
        res.status(200).json({ success: true, message: "Link sent" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
});
exports.forgetPassword = forgetPassword;
const verifyLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email } = req.query;
        if (!email || typeof email !== "string") {
            res.status(400).json({ success: false, message: { server: "Token is required" } });
            return;
        }
        const user = yield employeeSchema_1.default.findOne({ email });
        if (!user || !user.resetToken) {
            res.status(404).json({ success: false, message: { server: "Token is missing or user not found" } });
            return;
        }
        if (Date.now() > ((_a = user.resetTokenExpiry) === null || _a === void 0 ? void 0 : _a.getTime())) {
            user.resetToken = undefined;
            user.resetTokenExpiry = undefined;
            yield user.save();
            res.status(400).json({ success: false, message: { server: "Token has expired" } });
            return;
        }
        const isValid = jsonwebtoken_1.default.verify(user.resetToken, process.env.JWT_SECRET);
        if (!isValid) {
            user.resetToken = undefined;
            user.resetTokenExpiry = undefined;
            yield user.save();
            res.status(400).json({ success: false, message: { server: "Invalid token" } });
            return;
        }
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
});
exports.verifyLink = verifyLink;
const newPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const message = (0, extractError_1.default)(errors.array());
        res.status(422).json({ success: false, message });
        return;
    }
    const { password, email } = req.body;
    try {
        if (!email) {
            res.status(400).json({
                success: false,
                message: { server: "Token is Required" },
            });
            return;
        }
        const user = yield employeeSchema_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                message: { server: "User not Found" },
            });
            return;
        }
        if (!user.resetToken) {
            res.status(404).json({
                success: false,
                message: { server: "Token is Missing" },
            });
            return;
        }
        if (Date.now() > ((_a = user === null || user === void 0 ? void 0 : user.resetTokenExpiry) === null || _a === void 0 ? void 0 : _a.getTime())) {
            user.resetToken = undefined;
            user.resetTokenExpiry = undefined;
            yield user.save();
            res.status(400).json({
                success: false,
                message: { server: "Token has expired" },
            });
            return;
        }
        // jwt.verify returns the decoded payload or throws error if invalid
        let isValidToken;
        try {
            isValidToken = jsonwebtoken_1.default.verify(user.resetToken, process.env.JWT_SECRET);
        }
        catch (_b) {
            res.status(400).json({
                success: false,
                message: { server: "Invalid or expired token" },
            });
        }
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        user.password = hashPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        yield user.save();
        res.status(200).json({
            success: true,
            message: "Change the Password",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: { server: error.message || "Server Error" },
        });
    }
});
exports.newPassword = newPassword;
const mfaVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const message = (0, extractError_1.default)(errors.array());
        res.status(422).json({ success: false, message });
        return;
    }
    const { otp, email } = req.body;
    const user = yield employeeSchema_1.default.findOne({ email }).select("-password");
    if (!user) {
        res.status(404).json({
            success: false,
            message: { server: "User not found" },
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(user.mfaVerifyToken, process.env.JWT_SECRET);
        if (decoded.otp === otp) {
            user.mfaVerifyToken = undefined;
            yield user.save();
            res.cookie("token", (0, generateToken_1.default)({ id: user._id.toString(), role: user.role }));
            res.status(200).json({
                success: true,
                message: "success",
            });
            return;
        }
        else {
            res.status(400).json({
                success: false,
                message: { server: "Wrong Otp" },
            });
            return;
        }
    }
    catch (error) {
        user.mfaVerifyToken = undefined;
        yield user.save();
        res.status(500).json({
            success: false,
            message: { server: error.message || "Token is Expired" },
        });
    }
});
exports.mfaVerification = mfaVerification;
