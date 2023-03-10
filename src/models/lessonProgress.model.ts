import { model, ObjectId, Schema } from "mongoose";

interface LessonProgressDocument extends Document {
  user: ObjectId;
  lesson: ObjectId;
  module: ObjectId;
  course: ObjectId;
  isCompleted: boolean;
  isAvailable: boolean;
}

const LessonProgressSchema = new Schema<LessonProgressDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Courses", required: true },
    lesson: { type: Schema.Types.ObjectId, ref: "Lessons", required: true },
    module: { type: Schema.Types.ObjectId, ref: "Modules", required: true },
    isCompleted: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

LessonProgressSchema.virtual("homework", {
  ref: "Homeworks",
  foreignField: "lesson",
  localField: "lesson",
  match: (progress: LessonProgressDocument) => ({ user: progress.user }),
  justOne: true,
});

export default model<LessonProgressDocument>(
  "UsersLessonProgress",
  LessonProgressSchema
);
