import express, { RequestHandler } from "express";
import {
  breakIn,
  breakOut,
  checkIn,
  checkOut,
  getAllAttendance,
  getUserAllAttendance,
} from "../controllers/attendanceController";
import { isAdmin } from "../middleware/auth";
import { ParamsDictionary } from "express-serve-static-core";

interface UserIdParams extends ParamsDictionary {
  id: string;
}

const router = express.Router();

router.get("/check-in", checkIn as RequestHandler);
router.get("/check-out", checkOut as RequestHandler);
router.get("/break-in", breakIn as RequestHandler);
router.get("/break-out", breakOut as RequestHandler);
router.get("/user/:id", getUserAllAttendance as RequestHandler<UserIdParams>);
router.get("/all", isAdmin as RequestHandler, getAllAttendance as RequestHandler);


export default router;
