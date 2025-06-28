import mongoose, {Schema,model,models} from "mongoose";


export interface EmergencyContact {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  contactName: string;
  relationship: string;
  mobileNumber: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const emergencyContactSchema = new Schema<EmergencyContact>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  contactName: { type: String, required: true },
  relationship: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  address: { type: String }
}, { timestamps: true });

export const EmergencyContactModel = models?.EmergencyContact || model<EmergencyContact>("EmergencyContact", emergencyContactSchema);