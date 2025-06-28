import mongoose, { Schema, model, models } from 'mongoose';

export interface Profile {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  fullName?: string;
  gender?: 'Male' | 'Female' | 'Other';
  emailVerified: boolean;
  mobileNumber?: string;
  mobileVerified: boolean;
  img?: string;
  fullPermanentAddress?: string;
  currentAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const profileSchema = new Schema<Profile>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String, required: true },
  fullName: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  emailVerified: { type: Boolean, default: false },
  mobileNumber: { type: String },
  mobileVerified: { type: Boolean, default: false },
  img: { type: String },
  fullPermanentAddress: { type: String },
  currentAddress: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String }
}, { timestamps: true });

export const ProfileModel = models?.Profile || model<Profile>("Profile", profileSchema);
