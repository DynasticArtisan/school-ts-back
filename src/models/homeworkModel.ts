import { Document, model, ObjectId, Schema } from "mongoose";
import { HomeworkStatus } from "src/utils/statuses";
import { IHomeworkFile } from "./homeworkFilesModel";

export interface IHomework extends Document {
  user: ObjectId;
  lesson: ObjectId;
  course: ObjectId;
  status: HomeworkStatus;
  comment?: string;
  files?: IHomeworkFile[];
}

const HomeworkSchema = new Schema<IHomework>(
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

export default model<IHomework>("Homeworks", HomeworkSchema);
