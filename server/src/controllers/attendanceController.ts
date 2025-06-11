import { Request, Response } from "express";
import Attendance from "../schema/attendanceSchema"; // adjust import path

// date conver into "2025-06-11"
const formatDate = (): string => {
  return new Date().toISOString().split("T")[0]
};

// Extend Express Request type to include user property (adjust as per your auth)
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// fetch user all attendance thief their id
export const getUserAllAttendance = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const id = req.params?.id;

  const startDate = req.query?.startDate ? new Date(req.query.startDate as string) : null;
  const endDate = req.query?.endDate ? new Date(req.query.endDate as string) : null;

  try {
    /**
     * employee attendance fetch between this month first to current date
     * the counth the each employee total working hours and days
     */
    const result = await Attendance.aggregate([
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: { server: error.message || "Server Error" },
    });
  }
};

// Get all employee attendance
export const getAllAttendance = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const result = await Attendance.aggregate([
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
  } catch (err) { // Unexpected error handling
    console.error("Error in getAllAttendance:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * action:checkin
 * validate: the allready checkin or not
 */
export const checkIn = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const today = formatDate();

    const existingAttendance = await Attendance.findOne({
      employee: userId,
      date: today,
    });

    if (existingAttendance?.checkInTime) {
      res.status(400).json({
        success: false,
        message: { server: "Already checked in for today." },
      });
      return;
    }

    const attendance = await Attendance.findOneAndUpdate(
      { employee: userId, date: today },
      { $set: { checkInTime: new Date(), date: today } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Check-in successful",
      data: attendance,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: { server: error.message || "Server Error" },
    });
  }
};

/**
 * action:checkOut
 * validate: 
 *        first checkin or not
 *         the allready checkout or not
 */
export const checkOut = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const today = formatDate();

    const attendance = await Attendance.findOne({
      employee: userId,
      date: today,
    });

    if (!attendance?.checkInTime) {
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
    const breakMs =
      attendance.breakInTime && attendance.breakOutTime
        ? attendance.breakOutTime.getTime() - attendance.breakInTime.getTime()
        : 0;
    const netMs = totalMs - breakMs;
    const workingHours = Math.round((netMs / (1000 * 60 * 60)) * 100) / 100;

    attendance.checkOutTime = now;
    attendance.workingHours = workingHours;
    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Check-out successful",
      data: attendance,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: { server: error.message || "Server Error" },
    });
  }
};

/**
  * action:breakIn
 * validate: 
 *        first checkin or not
 *        then checkout or not
 *        if allready take break or not
 */
export const breakIn = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const today = formatDate();

    const attendance = await Attendance.findOne({
      employee: userId,
      date: today,
    });

    if (!attendance?.checkInTime) {
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
    await attendance.save();

    res.status(200).json({ success: true, message: "Break started", data: attendance });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: { server: error.message || "Server Error" },
    });
  }
};

/**
 * action:breakIn
 * validate: 
 *        first checkin or not
 *        then checkout or not
 *        then take break or not
 */

export const breakOut = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const today = formatDate();

    const attendance = await Attendance.findOne({
      employee: userId,
      date: today,
    });

    if (!attendance?.breakInTime) {
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
    await attendance.save();

    res.status(200).json({ success: true, message: "Break ended", data: attendance });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: { server: error.message || "Server Error" },
    });
  }
};
