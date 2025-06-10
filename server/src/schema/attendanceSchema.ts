import mongoose, { Document, Schema, Model } from "mongoose";

export interface IAttendance extends Document {
  employee: mongoose.Types.ObjectId;
  date: Date;
  checkInTime?: Date;
  checkOutTime?: Date;
  breakInTime?: Date;
  breakOutTime?: Date;
  isManual: boolean;
  workingHours: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    employee: {
      type: Schema.Types.ObjectId,
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

// Unique index on employee and date
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendance: Model<IAttendance> = mongoose.model<IAttendance>(
  "Attendance",
  attendanceSchema
);

export default Attendance;
