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
exports.editLeave = exports.deleteSingleLeave = exports.rejectLeave = exports.approveLeave = exports.getMyLeaves = exports.getAllLeaveRequests = exports.applyLeave = void 0;
const leaveSchema_1 = __importDefault(require("../schema/leaveSchema"));
const express_validator_1 = require("express-validator");
const extractError_1 = __importDefault(require("../utils/extractError"));
const applyLeave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        let message = (0, extractError_1.default)(error.array());
        res.status(422).json({ success: false, message });
        return;
    }
    try {
        const { leaveType, startDate, endDate, reason, duration } = req.body;
        const isAllreadyTaken = yield leaveSchema_1.default.findOne({ employee: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, startDate: { $lte: startDate }, endDate: { $gte: endDate }, status: "Approved" });
        if (isAllreadyTaken) {
            res.status(201).json({ message: { server: 'Allready Taken the Leave.' }, success: false });
            return;
        }
        const leave = yield leaveSchema_1.default.create({
            employee: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
            leaveType,
            startDate,
            endDate,
            reason, duration
        });
        res.status(201).json({ message: { server: 'Leave applied successfully.' }, leave, success: true });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: { server: 'Error applying for leave.' }, success: false });
    }
});
exports.applyLeave = applyLeave;
const getAllLeaveRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leaves = yield leaveSchema_1.default.find().populate('employee', 'name employeeId email profilePhoto');
        res.status(200).json({ leaves, success: true });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching leave requests.', success: false });
    }
});
exports.getAllLeaveRequests = getAllLeaveRequests;
const getMyLeaves = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const leaves = yield leaveSchema_1.default.find({ employee: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
        res.status(200).json({ leaves, success: true });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching leaves.', success: false });
    }
});
exports.getMyLeaves = getMyLeaves;
const approveLeave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestsToUpdate } = req.body;
        let approvedAt = new Date();
        yield leaveSchema_1.default.updateMany({ _id: { $in: requestsToUpdate } }, {
            status: "Approved",
            approvedAt
        });
        res.status(200).json({ message: 'Leave approved successfully.', success: true, approvedAt });
    }
    catch (error) {
        res.status(500).json({ message: 'Error approving leave.', success: false });
    }
});
exports.approveLeave = approveLeave;
const rejectLeave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestsToUpdate, reason } = req.body;
        let rejectedAt = new Date();
        yield leaveSchema_1.default.updateMany({ _id: { $in: requestsToUpdate } }, {
            status: "Rejected",
            rejectedReason: reason,
            rejectedAt
        });
        res.status(200).json({ message: 'Leave rejected successfully.', success: true, rejectedAt, reason });
    }
    catch (error) {
        res.status(500).json({ message: 'Error rejecting leave.', success: false });
    }
});
exports.rejectLeave = rejectLeave;
const deleteSingleLeave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leave = yield leaveSchema_1.default.findById(req.params.id);
        if (!leave) {
            res.status(404).json({ message: 'Leave not found', success: false });
            return;
        }
        if (leave.status != "Pending") {
            res.status(401).json({ message: 'Not Delete The Leave Request', success: false });
            return;
        }
        yield leaveSchema_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Leave Deleted successfully.', success: true });
    }
    catch (error) {
        res.status(500).json({ message: 'Error rejecting leave.', success: false });
    }
});
exports.deleteSingleLeave = deleteSingleLeave;
const editLeave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leave = yield leaveSchema_1.default.findById(req.params.id);
        if (!leave) {
            res.status(404).json({ message: 'Leave not found', success: false });
            return;
        }
        if (leave.status != "Pending") {
            res.status(401).json({ message: 'Not Edit The Leave Request', success: false });
            return;
        }
        const { leaveType, startDate, endDate, reason, duration } = req.body;
        yield leaveSchema_1.default.findByIdAndUpdate(req.params.id, {
            leaveType, startDate, endDate, reason, duration
        });
        res.status(200).json({ message: 'Leave successfully Updated.', success: true });
    }
    catch (error) {
        res.status(500).json({ message: 'Error rejecting leave.', success: false });
    }
});
exports.editLeave = editLeave;
