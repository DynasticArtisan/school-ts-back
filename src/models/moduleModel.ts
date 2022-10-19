import { model, ObjectId, Schema } from "mongoose";
import { ModuleProgressDocument } from "./moduleProgressModel";

export interface ModuleDocument extends Document {
  title: string;
  description: string;
  firstModule: boolean;
  prevModule: ObjectId;
  course: ObjectId;
  progress?: ModuleProgressDocument;
}

const ModuleSchema = new Schema<ModuleDocument>({
  title: { type: String },
  description: { type: String },
  course: { type: Schema.Types.ObjectId, rel: "Courses" },
  firstModule: { type: Boolean, default: false },
  prevModule: { type: Schema.Types.ObjectId, rel: "Modules" },
});

ModuleSchema.virtual("nextModule", {
  ref: "Modules",
  localField: "_id",
  foreignField: "prevModule",
  justOne: true,
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

export default model<ModuleDocument>("Modules", ModuleSchema);
