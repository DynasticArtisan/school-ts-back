import { model, Schema } from "mongoose";

export interface ITemplate {
  type: string;
  title: string;
  image?: string;
  icon?: string;
  body: string;
}

const TemplateSchema = new Schema<ITemplate>({
  type: { type: String, required: true, default: "custom" },
  title: { type: String, required: true },
  image: { type: String },
  icon: { type: String },
  body: { type: String, required: true },
});

export default model("NotifTemplates", TemplateSchema);
