import mongoose, { Document, Schema } from "mongoose";

export interface IQuestion {
  number: number;
  text: string;
  difficulty: "Easy" | "Moderate" | "Hard";
  marks: number;
  options?: string[];         // MCQ only
  answerHint?: string;        // For answer key
}

export interface ISection {
  name: string;               // "A", "B", "C" ...
  title: string;              // e.g. "Multiple Choice Questions"
  instruction: string;
  questions: IQuestion[];
}

export interface IGenerationResult extends Document {
  _id: mongoose.Types.ObjectId;
  assignmentId: mongoose.Types.ObjectId;
  jobId: string;
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  totalMarks: number;
  sections: ISection[];
  answerKey: string[];
  generatedAt: Date;
  promptUsed?: string;
  tokensUsed?: number;
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    number: { type: Number, required: true },
    text: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Moderate", "Hard"], required: true },
    marks: { type: Number, required: true, min: 1 },
    options: [{ type: String }],
    answerHint: { type: String },
  },
  { _id: false }
);

const SectionSchema = new Schema<ISection>(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
  },
  { _id: false }
);

const GenerationResultSchema = new Schema<IGenerationResult>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment", required: true, index: true },
    jobId: { type: String, required: true, unique: true, index: true },
    schoolName: { type: String, default: "Delhi Public School, Sector-4, Bokaro" },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    timeAllowed: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    sections: { type: [SectionSchema], required: true },
    answerKey: [{ type: String }],
    generatedAt: { type: Date, default: Date.now },
    promptUsed: { type: String, select: false },   // hidden by default
    tokensUsed: { type: Number },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

GenerationResultSchema.index({ assignmentId: 1, createdAt: -1 });

export const GenerationResult = mongoose.model<IGenerationResult>(
  "GenerationResult",
  GenerationResultSchema
);
