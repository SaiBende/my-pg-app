import mongoose, {Schema,model,models} from "mongoose";

export interface KYC {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  referenceNumber: string;
  isVerifiedByAdmin: boolean;
  verifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const kycSchema = new Schema<KYC>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  referenceNumber: { type: String, required: true, unique: true },
  isVerifiedByAdmin: { type: Boolean, default: false },
  verifiedAt: { type: Date }
}, { timestamps: true });

kycSchema.pre("save", function (next) {
  if (!this.referenceNumber) {
    this.referenceNumber = "KYC-" + Date.now();
  }
  next();
});

export const KYC = models?.KYC || model<KYC>("KYC", kycSchema);