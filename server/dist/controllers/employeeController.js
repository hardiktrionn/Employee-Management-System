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
exports.getSingleEmployee = exports.deleteUser = exports.getAllEmployees = void 0;
const employeeSchema_1 = __importDefault(require("../schema/employeeSchema")); // Adjust path as necessary
const getAllEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield employeeSchema_1.default.find({ role: "employee" }).select("-password");
        res.status(200).json({ success: true, data: employees });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.getAllEmployees = getAllEmployees;
// DELETE a user by ID
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedEmp = yield employeeSchema_1.default.findByIdAndDelete(id);
        if (!deletedEmp) {
            res.status(404).json({ success: false, message: "User not found or already deleted" });
            return;
        }
        res.status(200).json({ success: true, message: "User deleted successfully", id });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.deleteUser = deleteUser;
// GET a single employee by ID
const getSingleEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const employee = yield employeeSchema_1.default.findById(id).select("-password");
        if (!employee) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({ success: true, message: "User fetched successfully", data: employee });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.getSingleEmployee = getSingleEmployee;
