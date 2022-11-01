import { Document, model, ObjectId, Schema } from "mongoose";

export interface CourseInput {
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  icon?: string;
}

export interface CourseDocument extends Document, CourseInput {
  _id: ObjectId;
}

const CourseSchema = new Schema<CourseDocument>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  icon: { type: String, required: true },
});

CourseSchema.virtual("modules", {
  ref: "Modules",
  localField: "_id",
  foreignField: "course",
});
CourseSchema.virtual("firstModule", {
  ref: "Modules",
  localField: "_id",
  foreignField: "course",
  match: { index: 0 },
  justOne: true,
});

CourseSchema.virtual("exercises", {
  ref: "Lessons",
  localField: "_id",
  foreignField: "course",
  match: {
    withExercise: true,
  },
});
CourseSchema.virtual("students", {
  ref: "UsersCourseProgress",
  localField: "_id",
  foreignField: "course",
});

CourseSchema.virtual("progress", {
  ref: "UsersCourseProgress",
  localField: "_id",
  foreignField: "course",
  justOne: true,
});

CourseSchema.virtual("mastering", {
  ref: "CourseMasters",
  localField: "_id",
  foreignField: "course",
  justOne: true,
});

CourseSchema.virtual("totalCompleted", {
  ref: "UsersCourseProgress",
  localField: "_id",
  foreignField: "course",
  match: {
    isCompleted: true,
  },
  count: true,
});

CourseSchema.virtual("totalInProgress", {
  ref: "UsersCourseProgress",
  localField: "_id",
  foreignField: "course",
  match: {
    isCompleted: false,
    isAvailable: true,
  },
  count: true,
});

export default model<CourseDocument>("Courses", CourseSchema);
