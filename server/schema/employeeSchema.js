const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },
    mfaEnabled: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      default: null,
    },
    mfaVerifyToken: {
      type: String,
    },
    facebookId: {
      type: String,
      default: null,
    },
    resetToken: String,
    resetTokenExpiry: Date,
    contact: String,
    address: String,
    dob: Date,
    emergencyContact: String,
    employeeId: {
      type: String,
      unique: true,
    },

    socialMedia: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },

    designation: String,
    department: String,
    joiningDate: Date,
    profilePhoto: {
      type: String,
      default: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employee", employeeSchema);
