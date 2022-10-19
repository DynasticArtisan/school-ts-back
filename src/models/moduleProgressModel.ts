import { model, ObjectId, Schema } from "mongoose";

interface ModuleProgressDocument extends Document {
  user: ObjectId;
  module: ObjectId;
  course: ObjectId;
  isCompleted: boolean;
  isAvailable: boolean;
}

const ModuleProgressSchema = new Schema<ModuleProgressDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  course: { type: Schema.Types.ObjectId, ref: "Courses" },
  module: { type: Schema.Types.ObjectId, rel: "Modules" },
  isCompleted: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
});

module.exports = model<ModuleProgressDocument>(
  "UsersModuleProgress",
  ModuleProgressSchema
);
