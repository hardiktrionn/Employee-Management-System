const express = require("express");
const {
  checkIn,
  checkOut,
  getAllAttendance,
  breakIn,
  breakOut,
  getUserAllAttendance,
} = require("../controllers/attendanceController");
const { isAdmin } = require("../middleware/auth");
const router = express.Router();

router.get("/check-in", checkIn);
router.get("/check-out", checkOut);
router.get("/break-in", breakIn);
router.get("/break-out", breakOut);
router.get("/user/:id", getUserAllAttendance);
router.get("/all", isAdmin, getAllAttendance);

module.exports = router;
