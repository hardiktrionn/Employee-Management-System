import mongoose, { Document, Schema, Model } from "mongoose";

export interface ICounter extends Document {
  _id: string;
  seq: number;
}

const counterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1000 },
});

const Counter: Model<ICounter> = mongoose.model<ICounter>("Counter", counterSchema);

export default Counter;
