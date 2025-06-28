import mongoose, {Schema,model,models} from "mongoose";

export interface BankDetails {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  branchName?: string;
  accountType: 'Savings' | 'Current';
  createdAt?: Date;
  updatedAt?: Date;
}

const bankDetailsSchema = new Schema<BankDetails>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  accountHolderName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  bankName: { type: String, required: true },
  ifscCode: { type: String, required: true },
  branchName: { type: String },
  accountType: { type: String, enum: ["Savings", "Current"], required: true }
}, { timestamps: true });

export const BankDetailsModel = models?.BankDetails || model<BankDetails>("BankDetails", bankDetailsSchema);