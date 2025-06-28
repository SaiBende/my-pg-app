import mongoose, { Schema, model, models } from 'mongoose';

export interface ProfessionalDetails {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  professionalStatus: 'College Student' | 'Working Professional';
  college?: {
    name?: string;
    course?: string;
    yearOfStudy?: string;
    rollNumber?: string;
    address?: string;
  };
  work?: {
    companyName?: string;
    designation?: string;
    employeeId?: string;
    experienceYears?: number;
    officeAddress?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const professionalDetailsSchema = new Schema<ProfessionalDetails>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  professionalStatus: { type: String, enum: ["College Student", "Working Professional"], required: true },
  college: {
    name: String,
    course: String,
    yearOfStudy: String,
    rollNumber: String,
    address: String,
  },
  work: {
    companyName: String,
    designation: String,
    employeeId: String,
    experienceYears: Number,
    officeAddress: String,
  }
}, { timestamps: true });

export const ProfessionalDetails = models?.ProfessionalDetails || model<ProfessionalDetails>("ProfessionalDetails", professionalDetailsSchema);