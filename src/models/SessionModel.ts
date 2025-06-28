import mongoose, { Schema, model, models } from 'mongoose';

export interface Session {
  token: string;
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: mongoose.Types.ObjectId;
}

const sessionSchema = new Schema<Session>(
  {
    token: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    expiresAt: { type: Date, required: true },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String },
  },
  { timestamps: true }
);

const Session = models?.Session || model<Session>('Session', sessionSchema);

export default Session;
