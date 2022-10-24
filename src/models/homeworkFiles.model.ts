import { model, ObjectId, Schema } from "mongoose";

export interface HomeworkFileDocument extends Document {
  homework: ObjectId;
  user: ObjectId;
  filename: String;
  filepath: String;
}

const FilesSchema = new Schema<HomeworkFileDocument>(
  {
    homework: { type: Schema.Types.ObjectId, required: true, ref: "Homeworks" },
    user: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
    filename: { type: String, required: true },
    filepath: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default model<HomeworkFileDocument>("HomeworkFiles", FilesSchema);
