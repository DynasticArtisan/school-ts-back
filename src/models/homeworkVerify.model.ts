import { model, ObjectId, Schema } from "mongoose";

interface HomeworkVerifyDocument extends Document {
  homework: ObjectId;
  user: ObjectId;
  course: ObjectId;
}

const HomeworkVerifySchema = new Schema<HomeworkVerifyDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    homework: { type: Schema.Types.ObjectId, ref: "Homeworks", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Courses", required: true },
  },
  {
    timestamps: true,
  }
);

export default model<HomeworkVerifyDocument>(
  "HomeworkVerifies",
  HomeworkVerifySchema
);
