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
exports.breakOut = exports.breakIn = exports.checkOut = exports.checkIn = exports.getAllAttendance = exports.getUserAllAttendance = void 0;
const attendanceSchema_1 = __importDefault(require("../schema/attendanceSchema")); // adjust import path
const formatDate = () => {
    return new Date().toISOString().split("T")[0];
};
const getUserAllAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
    const startDate = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.startDate) ? new Date(req.query.startDate) : null;
    const endDate = ((_c = req.query) === null || _c === void 0 ? void 0 : _c.endDate) ? new Date(req.query.endDate) : null;
    try {
        const result = yield attendanceSchema_1.default.aggregate([
            {
                $lookup: {
                    from: "employees",
                    localField: "employee",
                    foreignField: "_id",
                    as: "employeeData",
                },
            },
            { $unwind: "$employeeData" },
            {
                $match: {
                    date: { $gte: startDate, $lte: endDate },
                    "employeeData.employeeId": id,
                },
            },
            {
                $group: {
                    _id: "$employee",
                    logs: {
                        $push: {
                            date: "$date",
                            checkInTime: "$checkInTime",
                            checkOutTime: "$checkOutTime",
                            breakInTime: "$breakInTime",
                            breakOutTime: "$breakOutTime",
                            workingHours: "$workingHours",
                        },
                    },
                    name: { $first: "$employeeData.name" },
                    profile: { $first: "$employeeData.profilePhoto" },
                    totalHours: { $sum: "$workingHours" },
                    totalDays: { $sum: 1 },
                },
            },
            { $sort: { _id: -1 } },
        ]);
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: { server: error.message || "Server Error" },
        });
    }
});
exports.getUserAllAttendance = getUserAllAttendance;
const getAllAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield attendanceSchema_1.default.aggregate([
            { $sort: { date: 1 } },
            {
                $group: {
                    _id: "$employee",
                    totalDays: { $sum: 1 },
                    totalHours: { $sum: "$workingHours" },
                    avgWorkingHours: { $avg: "$workingHours" },
                },
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "_id",
                    foreignField: "_id",
                    as: "employeeInfo",
                },
            },
            { $unwind: "$employeeInfo" },
            {
                $project: {
                    _id: 0,
                    employeeId: "$employeeInfo.employeeId",
                    name: "$employeeInfo.name",
                    email: "$employeeInfo.email",
                    totalDays: 1,
                    totalHours: 1,
                    avgWorkingHours: 1,
                    logs: 1,
                },
            },
        ]);
        if (!result || result.length === 0) {
            res.status(404).json({ success: false, message: "No attendance data found" });
            return;
        }
        res.status(200).json({ success: true, data: result });
    }
    catch (err) {
        console.error("Error in getAllAttendance:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.getAllAttendance = getAllAttendance;
const checkIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const today = formatDate();
        const existingAttendance = yield attendanceSchema_1.default.findOne({
            employee: userId,
            date: today,
        });
        if (existingAttendance === null || existingAttendance === void 0 ? void 0 : existingAttendance.checkInTime) {
            res.status(400).json({
                success: false,
                message: { server: "Already checked in for today." },
            });
            return;
        }
        const attendance = yield attendanceSchema_1.default.findOneAndUpdate({ employee: userId, date: today }, { $set: { checkInTime: new Date(), date: today } }, { upsert: true, new: true, setDefaultsOnInsert: true });
        res.status(200).json({
            success: true,
            message: "Check-in successful",
            data: attendance,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: { server: error.message || "Server Error" },
        });
    }
});
exports.checkIn = checkIn;
const checkOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const today = formatDate();
        const attendance = yield attendanceSchema_1.default.findOne({
            employee: userId,
            date: today,
        });
        if (!(attendance === null || attendance === void 0 ? void 0 : attendance.checkInTime)) {
            res.status(400).json({
                success: false,
                message: { server: "You have not checked in today." },
            });
            return;
        }
        if (attendance.checkOutTime) {
            res.status(400).json({
                success: false,
                message: { server: "Already checked out for today." },
            });
            return;
        }
        const now = new Date();
        const totalMs = now.getTime() - attendance.checkInTime.getTime();
        const breakMs = attendance.breakInTime && attendance.breakOutTime
            ? attendance.breakOutTime.getTime() - attendance.breakInTime.getTime()
            : 0;
        const netMs = totalMs - breakMs;
        const workingHours = Math.round((netMs / (1000 * 60 * 60)) * 100) / 100;
        attendance.checkOutTime = now;
        attendance.workingHours = workingHours;
        yield attendance.save();
        res.status(200).json({
            success: true,
            message: "Check-out successful",
            data: attendance,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: { server: error.message || "Server Error" },
        });
    }
});
exports.checkOut = checkOut;
const breakIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const today = formatDate();
        const attendance = yield attendanceSchema_1.default.findOne({
            employee: userId,
            date: today,
        });
        if (!(attendance === null || attendance === void 0 ? void 0 : attendance.checkInTime)) {
            res.status(400).json({
                success: false,
                message: { server: "You need to check in first." },
            });
            return;
        }
        if (attendance.checkOutTime) {
            res.status(400).json({
                success: false,
                message: { server: "You are checked out." },
            });
            return;
        }
        if (attendance.breakInTime) {
            res.status(400).json({
                success: false,
                message: { server: "You are already on break." },
            });
            return;
        }
        attendance.breakInTime = new Date();
        yield attendance.save();
        res.status(200).json({ success: true, message: "Break started", data: attendance });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: { server: error.message || "Server Error" },
        });
    }
});
exports.breakIn = breakIn;
const breakOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const today = formatDate();
        const attendance = yield attendanceSchema_1.default.findOne({
            employee: userId,
            date: today,
        });
        if (!(attendance === null || attendance === void 0 ? void 0 : attendance.breakInTime)) {
            res.status(400).json({
                success: false,
                message: { server: "Break-in not recorded." },
            });
            return;
        }
        if (attendance.checkOutTime) {
            res.status(400).json({
                success: false,
                message: { server: "You are checked out." },
            });
            return;
        }
        if (attendance.breakOutTime) {
            res.status(400).json({
                success: false,
                message: { server: "You have already ended your break." },
            });
            return;
        }
        attendance.breakOutTime = new Date();
        yield attendance.save();
        res.status(200).json({ success: true, message: "Break ended", data: attendance });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: { server: error.message || "Server Error" },
        });
    }
});
exports.breakOut = breakOut;
