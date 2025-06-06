const Attendance = require("../schema/attendanceSchema");

const formatDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const getUserAllAttendance = async (req, res) => {
  const id = req.params?.id;

  const startDate = req?.query?.startDate
    ? new Date(req.query.startDate)
    : null;
  const endDate = req?.query?.endDate ? new Date(req.query.endDate) : null;

  try {
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

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: { server: error.message || "Server Error" },
    });
  }
};

const getAllAttendance = async (req, res) => {
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
          _id: 0, // hide MongoDB default _id
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
      return res
        .status(404)
        .json({ success: false, message: "No attendance data found" });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("Error in getAllAttendance:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = formatDate();

    const existingAttendance = await Attendance.findOne({
      employee: userId,
      date: today,
    });

    if (existingAttendance && existingAttendance.checkInTime) {
      return res.status(400).json({
        success: false,
        message: { server: "Already checked in for today." },
      });
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: { server: error.message || "Server Error" },
    });
  }
};

const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = formatDate();

    const attendance = await Attendance.findOne({
      employee: userId,
      date: today,
    });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({
        success: false,
        message: { server: "You have not checked in today." },
      });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: { server: "Already checked out for today." },
      });
    }

    const now = new Date();
    const totalMs = now - attendance.checkInTime;
    const breakMs =
      attendance.breakInTime && attendance.breakOutTime
        ? attendance.breakOutTime - attendance.breakInTime
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: { server: error.message || "Server Error" },
    });
  }
};

const breakIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = formatDate();

    const attendance = await Attendance.findOne({
      employee: userId,
      date: today,
    });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({
        success: false,
        message: { server: "You need to check in first." },
      });
    }

    if (attendance.checkOutTime) {
      return res
        .status(400)
        .json({ success: false, message: { server: "You are Check out." } });
    }

    if (attendance.breakInTime) {
      return res.status(400).json({
        success: false,
        message: { server: "You are already on break." },
      });
    }

    attendance.breakInTime = new Date();
    await attendance.save();

    res
      .status(200)
      .json({ success: true, message: "Break started", data: attendance });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: { server: error.message || "Server Error" },
    });
  }
};

const breakOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = formatDate();

    const attendance = await Attendance.findOne({
      employee: userId,
      date: today,
    });

    if (!attendance || !attendance.breakInTime) {
      return res.status(400).json({
        success: false,
        message: { server: "Break-in not recorded." },
      });
    }

    if (attendance.checkOutTime) {
      return res
        .status(400)
        .json({ success: false, message: { server: "You are Check out." } });
    }

    if (attendance.breakOutTime) {
      return res.status(400).json({
        success: false,
        message: { server: "You have already ended your break." },
      });
    }

    attendance.breakOutTime = new Date();
    await attendance.save();

    res
      .status(200)
      .json({ success: true, message: "Break ended", data: attendance });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: { server: error.message || "Server Error" },
    });
  }
};

module.exports = {
  checkIn,
  checkOut,
  breakIn,
  breakOut,
  getAllAttendance,
  getUserAllAttendance,
};
