import mongoose, { Document, Schema, Model } from "mongoose";

export interface ISocialMedia {
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface IEmployee extends Document {
  name: string;
  email: string;
  
  password?: string;
  role: "admin" | "employee";
  mfaEnabled: boolean;
  googleId?: string | null;
  mfaVerifyToken?: string;
  facebookId?: string | null;
  resetToken?: string;
  resetTokenExpiry?: Date;
  contact?: string;
  address?: string;
  dob?: Date;
  emergencyContact?: string;
  employeeId?: string;
  socialMedia?: ISocialMedia;
  designation?: string;
  department?: string;
  joiningDate?: Date;
  profilePhoto?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const socialMediaSchema = new Schema<ISocialMedia>({
  linkedin: { type: String, default: "" },
  github: { type: String, default: "" },
  twitter: { type: String, default: "" },
});

const employeeSchema = new Schema<IEmployee>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    role: { type: String, enum: ["admin", "employee"], default: "employee" },
    mfaEnabled: { type: Boolean, default: false },
    googleId: { type: String, default: null },
    mfaVerifyToken: { type: String },
    facebookId: { type: String, default: null },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    contact: { type: String },
    address: { type: String },
    dob: { type: Date },
    emergencyContact: { type: String },
    employeeId: { type: String, unique: true },
    socialMedia: { type: socialMediaSchema, default: {} },
    designation: { type: String },
    department: { type: String },
    joiningDate: { type: Date },
    profilePhoto: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
    },
  },
  { timestamps: true }
);

const Employee: Model<IEmployee> = mongoose.model<IEmployee>("Employee", employeeSchema);

export default Employee;
