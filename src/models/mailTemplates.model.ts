import { Document, model, Schema } from "mongoose";
import { UserDocument } from "./user.model";

export enum MailTemplateType {
  custom = "custom",
  activate = "activate",
  resetpassword = "resetpassword",
}
interface PopulateDocuments {
  user?: UserDocument;
}

export interface MailTemplateDocument extends Document {
  type: MailTemplateType;
  title: string;
  subject: string;
  html: string;
  prepare(object: PopulateDocuments): { subject: string; html: string };
}

const MailTemplateSchema = new Schema<MailTemplateDocument>({
  type: { type: String, default: MailTemplateType.custom },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  html: { type: String, required: true },
});

MailTemplateSchema.methods.prepare = function ({ user }: PopulateDocuments) {
  let { subject, html } = this as MailTemplateDocument;
  if (user) {
    subject = subject.replace("#user-name#", user.name);
    html = html.replace("#user-name#", user.name);
  }
  return { subject, html };
};

const MailTemplateModel = model<MailTemplateDocument>(
  "MailTemplate",
  MailTemplateSchema
);
export default MailTemplateModel;
