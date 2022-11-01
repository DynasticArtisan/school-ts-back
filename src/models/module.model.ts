import { model, ObjectId, Schema } from "mongoose";

export interface ModuleDocument extends Document {
  _id: ObjectId;
  index: number;
  course: ObjectId;
  title: string;
  description: string;
}

const ModuleSchema = new Schema<ModuleDocument>({
  index: { type: Number, required: true },
  course: { type: Schema.Types.ObjectId, rel: "Courses" },
  title: { type: String },
  description: { type: String },
});

ModuleSchema.virtual("lessons", {
  ref: "Lessons",
  localField: "_id",
  foreignField: "module",
});
ModuleSchema.virtual("progress", {
  ref: "UsersModuleProgress",
  localField: "_id",
  foreignField: "module",
  justOne: true,
});
ModuleSchema.virtual("firstLesson", {
  ref: "Lessons",
  localField: "_id",
  foreignField: "module",
  match: { index: 0 },
  justOne: true,
});
export default model<ModuleDocument>("Modules", ModuleSchema);
