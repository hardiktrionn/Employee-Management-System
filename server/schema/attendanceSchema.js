const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    breakInTime: {
      type: Date,
    },
    breakOutTime: {
      type: Date,
    },
    isManual: {
      type: Boolean,
      default: false,
    },
    workingHours: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate entries for same employee and date
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
