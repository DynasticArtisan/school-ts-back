import { Document, model, ObjectId, Schema } from "mongoose";

export enum HomeworkStatus {
  wait = "Ожидает проверки",
  accept = "Хорошее",
  reject = "Требует доработки",
}

export interface HomeworkDocument extends Document {
  user: ObjectId;
  lesson: ObjectId;
  course: ObjectId;
  status: HomeworkStatus;
  comment?: string;
}

const HomeworkSchema = new Schema<HomeworkDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lesson: { type: Schema.Types.ObjectId, ref: "Lessons", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Courses", required: true },
    status: {
      type: String,
      default: HomeworkStatus.wait,
      required: true,
    },
    comment: { type: String },
  },
  {
    timestamps: true,
  }
);

HomeworkSchema.virtual("files", {
  ref: "HomeworkFiles",
  foreignField: "homework",
  localField: "_id",
});

export default model<HomeworkDocument>("Homeworks", HomeworkSchema);
