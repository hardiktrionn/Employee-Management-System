"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaveController_1 = require("../controllers/leaveController");
const auth_1 = require("../middleware/auth");
const leaveValidator_1 = require("../validator/leaveValidator");
const router = express_1.default.Router();
router.post('/apply', leaveValidator_1.registerLeave, leaveController_1.applyLeave);
router.get('/all', auth_1.isAdmin, leaveController_1.getAllLeaveRequests);
router.get('/my/:id', leaveController_1.getMyLeaves);
router.put('/approve', auth_1.isAdmin, leaveController_1.approveLeave);
router.put('/reject', auth_1.isAdmin, leaveController_1.rejectLeave);
router.put("/edit/:id", leaveController_1.editLeave);
router.delete("/delete/:id", leaveController_1.deleteSingleLeave);
exports.default = router;
