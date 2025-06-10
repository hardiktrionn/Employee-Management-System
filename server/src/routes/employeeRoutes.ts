import express, { RequestHandler } from "express";
import {
  deleteUser,
  getAllEmployees,
  getSingleEmployee,
} from "../controllers/employeeController";
import { updateProfileValidator } from "../validator/authValidator";
import uploadMiddleware from "../middleware/multer";
import { updateProfile } from "../controllers/authController";

const router = express.Router();

router.get("/", getAllEmployees);
router.delete("/:id", deleteUser);
router.get("/:id", getSingleEmployee);
router.put("/:id", uploadMiddleware as RequestHandler, updateProfileValidator, updateProfile as RequestHandler );

export default router;
