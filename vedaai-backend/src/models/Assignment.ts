import mongoose, { Document, Schema } from "mongoose";

export interface IQuestionType {
  type: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
}

export interface IAssignment extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  teacherId: mongoose.Types.ObjectId;
  subject: string;
  className: string;
  dueDate: Date;
  questionTypes: IQuestionType[];
  additionalInstructions?: string;
  uploadedFileUrl?: string;
  status: "draft" | "generating" | "ready" | "failed";
  jobId?: string;
  resultId?: mongoose.Types.ObjectId;
  assignedOn: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionTypeSchema = new Schema<IQuestionType>(
  {
    type: { type: String, required: true },
    numberOfQuestions: { type: Number, required: true, min: 1 },
    marksPerQuestion: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true, index: true },
    subject: { type: String, required: true, trim: true },
    className: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
    questionTypes: { type: [QuestionTypeSchema], required: true, validate: { validator: (v: IQuestionType[]) => v.length > 0, message: "At least one question type is required" } },
    additionalInstructions: { type: String, maxlength: 1000 },
    uploadedFileUrl: { type: String },
    status: { type: String, enum: ["draft", "generating", "ready", "failed"], default: "draft", index: true },
    jobId: { type: String, index: true },
    resultId: { type: Schema.Types.ObjectId, ref: "GenerationResult" },
    assignedOn: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: total questions
AssignmentSchema.virtual("totalQuestions").get(function () {
  return this.questionTypes.reduce((sum, qt) => sum + qt.numberOfQuestions, 0);
});

// Virtual: total marks
AssignmentSchema.virtual("totalMarks").get(function () {
  return this.questionTypes.reduce((sum, qt) => sum + qt.numberOfQuestions * qt.marksPerQuestion, 0);
});

AssignmentSchema.index({ teacherId: 1, createdAt: -1 });
AssignmentSchema.index({ status: 1, teacherId: 1 });

export const Assignment = mongoose.model<IAssignment>("Assignment", AssignmentSchema);
