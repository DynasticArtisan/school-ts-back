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

interface PopulateDocuments {
  user?: UserDocument;
  course?: CourseDocument;
  lesson?: LessonDocument;
}

export interface TemplateDocument extends Document {
  type: NotifTemplateTypes;
  title: string;
  image?: string;
  icon?: string;
  body: string;
  prepare(object: PopulateDocuments): {
    title: string;
    image?: string;
    icon?: string;
    body: string;
  };
}

const TemplateSchema = new Schema<TemplateDocument>({
  type: { type: String, required: true, default: NotifTemplateTypes.custom },
  title: { type: String, required: true },
  image: { type: String },
  icon: { type: String },
  body: { type: String, required: true },
});

TemplateSchema.methods.prepare = function ({
  user,
  course,
  lesson,
}: PopulateDocuments): {
  title: string;
  image?: string;
  icon?: string;
  body: string;
} {
  let { title, image, icon, body } = this as TemplateDocument;
  console.log(course);
  if (user) {
    body = body.replace("#user-name#", user.name);
  }
  if (course) {
    body = body.replace("#course-title#", course.title);
  }
  if (lesson) {
    body = body.replace("#lesson-title#", lesson.title);
  }
  return {
    title,
    image,
    icon,
    body,
  };
};

export default model<TemplateDocument>("NotifTemplates", TemplateSchema);
