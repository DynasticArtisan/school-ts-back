import { model, ObjectId, Schema } from "mongoose";

interface LessonDocument extends Document {
  title: string;
  description: string;
  content: string;
  withExercise: boolean;
  exercise: string;
  firstLesson: boolean;
  prevLesson: ObjectId;
  module: ObjectId;
  course: ObjectId;
}

const LessonSchema = new Schema<LessonDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  withExercise: { type: Boolean, default: false },
  exercise: { type: String },
  module: { type: Schema.Types.ObjectId, rel: "Modules", required: true },
  course: { type: Schema.Types.ObjectId, rel: "Courses", required: true },
  firstLesson: { type: Boolean, default: false },
  prevLesson: { type: Schema.Types.ObjectId, rel: "Lessons" },
});

LessonSchema.virtual("nextLesson", {
  ref: "Lessons",
  localField: "_id",
  foreignField: "prevLesson",
  justOne: true,
});

LessonSchema.virtual("progress", {
  ref: "UsersLessonProgress",
  localField: "_id",
  foreignField: "lesson",
  justOne: true,
});

export default model<LessonDocument>("Lessons", LessonSchema);
