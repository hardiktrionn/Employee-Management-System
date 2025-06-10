"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendanceController_1 = require("../controllers/attendanceController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/check-in", attendanceController_1.checkIn);
router.get("/check-out", attendanceController_1.checkOut);
router.get("/break-in", attendanceController_1.breakIn);
router.get("/break-out", attendanceController_1.breakOut);
router.get("/user/:id", attendanceController_1.getUserAllAttendance);
router.get("/all", auth_1.isAdmin, attendanceController_1.getAllAttendance);
exports.default = router;
