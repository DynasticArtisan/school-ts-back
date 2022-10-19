import { model, Schema } from "mongoose";
import { CourseMasterDocument } from "./courseMasterModel";
import { CourseProgressDocument } from "./courseProgressModel";
import { LessonDocument } from "./lessonModel";
import { ModuleDocument } from "./moduleModel";

export interface CourseInput {
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  icon?: string;
}

export interface CourseDocument extends Document, CourseInput {
  modules?: ModuleDocument[];
  exercises?: LessonDocument[];
  progress?: CourseProgressDocument;
  students?: CourseProgressDocument[];
  mastering?: CourseMasterDocument;
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
  match: { isAvailable: true },
});

CourseSchema.virtual("progress", {
  ref: "UsersCourseProgress",
  localField: "_id",
  foreignField: "course",
  match: { isAvailable: true },
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
