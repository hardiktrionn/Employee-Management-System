import mongoose, { Schema, Document } from 'mongoose';

export interface LeaveRequestDocument extends Document {
  employee: mongoose.Schema.Types.ObjectId;
  leaveType: 'personal' | 'sick' | 'vacation' | 'emergency';
  startDate: Date;
  endDate: Date;
  reason: string;
  duration: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectedReason?: string
}

const LeaveRequestSchema = new Schema<LeaveRequestDocument>({
  employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  leaveType: { type: String, enum: ['personal', 'sick', 'vacation', 'emergency'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  duration: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  appliedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  rejectedAt: { type: Date },
  rejectedReason: { type: String }
});

export default mongoose.model<LeaveRequestDocument>('LeaveRequest', LeaveRequestSchema);
