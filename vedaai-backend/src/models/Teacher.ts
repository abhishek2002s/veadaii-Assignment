import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface ITeacher extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  schoolName: string;
  schoolLocation: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const TeacherSchema = new Schema<ITeacher>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false, minlength: 8 },
    schoolName: { type: String, required: true, default: "Delhi Public School" },
    schoolLocation: { type: String, default: "Bokaro Steel City" },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

// Hash password before save
TeacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

TeacherSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const Teacher = mongoose.model<ITeacher>("Teacher", TeacherSchema);
