"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeController_1 = require("../controllers/employeeController");
const authValidator_1 = require("../validator/authValidator");
const multer_1 = __importDefault(require("../middleware/multer"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.get("/", employeeController_1.getAllEmployees);
router.delete("/:id", employeeController_1.deleteUser);
router.get("/:id", employeeController_1.getSingleEmployee);
router.put("/:id", multer_1.default, authValidator_1.updateProfileValidator, authController_1.updateProfile);
exports.default = router;
