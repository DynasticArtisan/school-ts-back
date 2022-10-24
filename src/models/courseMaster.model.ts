import { model, ObjectId, Schema } from "mongoose";

export interface CourseMasterDocument extends Document {
  user: ObjectId;
  course: ObjectId;
  isAvailable: boolean;
}

const CourseMasterSchema = new Schema<CourseMasterDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Courses", required: true },
    isAvailable: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

CourseMasterSchema.virtual("verifiedHomeworksCount", {
  ref: "HomeworkVerifies",
  localField: "course",
  foreignField: "course",
  count: true,
});

export default model<CourseMasterDocument>("CourseMasters", CourseMasterSchema);
