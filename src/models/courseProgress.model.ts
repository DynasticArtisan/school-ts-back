import { Date, model, ObjectId, Schema } from "mongoose";

export enum CourseProgressFormat {
  optimal = "оптимальный",
}

export interface CourseProgressDocument extends Document {
  user: ObjectId;
  course: ObjectId;
  format: CourseProgressFormat;
  isAvailable: boolean;
  isCompleted: boolean;
  endAt: Date;
}

const CourseProgressSchema = new Schema<CourseProgressDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Courses", required: true },
    format: {
      type: String,
      default: CourseProgressFormat.optimal,
    },
    isAvailable: { type: Boolean, default: true },
    isCompleted: { type: Boolean, default: false },
    endAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

CourseProgressSchema.virtual("completedLessonsCount", {
  ref: "UsersLessonProgress",
  localField: "course",
  foreignField: "course",
  match: (progress: CourseProgressDocument) => ({
    user: progress.user,
    isCompleted: true,
  }),
  count: true,
});
CourseProgressSchema.virtual("totalLessonsCount", {
  ref: "Lessons",
  localField: "course",
  foreignField: "course",
  count: true,
});
CourseProgressSchema.virtual("lastLesson", {
  ref: "UsersLessonProgress",
  localField: "course",
  foreignField: "course",
  match: (progress: CourseProgressDocument) => ({
    user: progress.user,
    isCompleted: true,
  }),
  justOne: true,
});

export default model<CourseProgressDocument>(
  "UsersCourseProgress",
  CourseProgressSchema
);
