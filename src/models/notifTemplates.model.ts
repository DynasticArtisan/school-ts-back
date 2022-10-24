import { Document, Model, model, Schema } from "mongoose";
import { CourseDocument } from "./course.model";
import { LessonDocument } from "./lesson.model";
import { UserDocument } from "./user.model";

export enum NotifTemplateTypes {
  custom = "custom",
  newUser = "new-user",
  courseLock = "course-lock",
  courseUnlock = "course-unlock",
  homeworkReject = "homework-reject",
  homeworkAccept = "homework-accept",
}

interface ReplaceData {
  user?: UserDocument;
  course?: CourseDocument;
  lesson?: LessonDocument;
}

export interface TemplateInput {
  type: NotifTemplateTypes;
  title: string;
  image?: string;
  icon?: string;
  body: string;
}

interface TemplateMethods {
  replace(data: ReplaceData): string;
}

type TemplateModel = Model<TemplateInput, {}, TemplateMethods>;

const TemplateSchema = new Schema<
  TemplateInput,
  TemplateModel,
  TemplateMethods
>({
  type: { type: String, required: true, default: NotifTemplateTypes.custom },
  title: { type: String, required: true },
  image: { type: String },
  icon: { type: String },
  body: { type: String, required: true },
});

TemplateSchema.method("replace", function replace(data: ReplaceData) {
  const body: string = this.body;
  if (data.user) {
    body.replace("#user-name#", data.user.name);
  }
  if (data.course) {
    body.replace("#course-title#", data.course.title);
  }
  if (data.lesson) {
    body.replace("#lesson-title#", data.lesson.title);
  }
  return body;
});

export default model<TemplateInput, TemplateModel>(
  "NotifTemplates",
  TemplateSchema
);
