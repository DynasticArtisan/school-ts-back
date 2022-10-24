import { model, ObjectId, Schema } from "mongoose";

export interface LessonDocument extends Document {
  _id: ObjectId;
  index: number;
  module: ObjectId;
  course: ObjectId;
  title: string;
  description: string;
  content: string;
  withExercise: boolean;
  exercise: string;
}

const LessonSchema = new Schema<LessonDocument>({
  index: { type: Number, required: true },
  module: { type: Schema.Types.ObjectId, rel: "Modules", required: true },
  course: { type: Schema.Types.ObjectId, rel: "Courses", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  withExercise: { type: Boolean, default: false },
  exercise: { type: String },
});

LessonSchema.virtual("progress", {
  ref: "UsersLessonProgress",
  localField: "_id",
  foreignField: "lesson",
  justOne: true,
});

export default model<LessonDocument>("Lessons", LessonSchema);
