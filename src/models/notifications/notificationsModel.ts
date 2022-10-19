import { model, ObjectId, Schema } from "mongoose";
import { ITemplate } from "./templatesModel";

export interface INotif {
  user: ObjectId;
  readed: boolean;
}

const NotifSchema = new Schema<INotif & ITemplate>({
  user: { type: Schema.Types.ObjectId, rel: "User", required: true },
  title: { type: String, required: true },
  image: { type: String },
  icon: { type: String },
  body: { type: String, required: true },
  readed: { type: Boolean, default: false },
});

export default model("Notifications", NotifSchema);
