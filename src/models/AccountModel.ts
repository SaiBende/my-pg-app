import mongoose, { Schema, model, models } from 'mongoose';

export interface Account {
  accountId: string;
  providerId: string; // 'google' or 'credential'
  userId: mongoose.Types.ObjectId;
  accessToken?: string;
  idToken?: string;
  accessTokenExpiresAt?: Date;
  scope?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: mongoose.Types.ObjectId;
}

const accountSchema = new Schema<Account>(
  {
    accountId: { type: String, required: true, unique: true },
    providerId: { type: String, required: true }, // e.g., 'google', 'credential'
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    accessToken: { type: String },
    idToken: { type: String },
    accessTokenExpiresAt: { type: Date },
    scope: { type: String },
    password: { type: String }, // Only for 'credential' provider
  },
  { timestamps: true,
    collection: "account", 
   }
);

const Account = models?.Account || model<Account>('Account', accountSchema);

export default Account;