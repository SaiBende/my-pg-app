import mongoose, { Schema, model, models } from 'mongoose';

export interface UserVerification {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  email?: {
    otp: string;
    createdAt: Date;
    verified: boolean;
  };
  mobile?: {
    otp: string;
    createdAt: Date;
    verified: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const verificationSchema = new Schema<UserVerification>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  email: {
    otp: { type: String },
    createdAt: { type: Date },
    verified: { type: Boolean, default: false }
  },
  mobile: {
    otp: { type: String },
    createdAt: { type: Date },
    verified: { type: Boolean, default: false }
  }
}, { timestamps: true });

export const UserVerification =
  models?.UserVerification || model<UserVerification>('UserVerification', verificationSchema);
