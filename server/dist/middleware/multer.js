"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + path_1.default.parse(file.originalname).name;
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
const uploadMiddleware = (req, res, next) => {
    upload.single("profilePhoto")(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: 0,
                message: { server: "File upload failed" },
            });
        }
        req.body.profilePhoto = "";
        if (req.file) {
            req.body.profilePhoto = req.file.originalname;
        }
        next();
    });
};
exports.default = uploadMiddleware;
