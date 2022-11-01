import { Document, model, ObjectId, Schema } from "mongoose";

export interface NotificationDocument extends Document {
  user: ObjectId;
  readed: boolean;
  title: string;
  image?: string;
  icon?: string;
  body: string;
}

const NotifSchema = new Schema<NotificationDocument>(
  {
    user: { type: Schema.Types.ObjectId, rel: "User", required: true },
    readed: { type: Boolean, default: false },
    title: { type: String, required: true },
    image: { type: String },
    icon: { type: String },
    body: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default model<NotificationDocument>("Notifications", NotifSchema);
