import mongoose, {Schema,model,models} from "mongoose";


export interface Documents {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  idProof: string;
  addressProof: string;
  passportPhoto: string;
  selfieWithId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const documentsSchema = new Schema<Documents>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  idProof: { type: String, required: true },
  addressProof: { type: String, required: true },
  passportPhoto: { type: String, required: true },
  selfieWithId: { type: String, required: true }
}, { timestamps: true });

export const Documents = models?.Documents || model<Documents>("Documents", documentsSchema);
