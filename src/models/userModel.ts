import { Document, model, Schema } from "mongoose";

export enum UserRole {
  user = "user",
  super = "super",
  admin = "admin",
  curator = "curator",
  teacher = "teacher",
}
export interface UserSettings {
  birthday?: string;
  phone?: string;
  city?: string;
  gender?: string;
  status?: string;
  avatar?: number;
}

export interface UserInput {
  name: string;
  surname: string;
  email: string;
  password: string;
  activateLink: string;
}
export interface UserDocument extends UserInput, Document {
  isActivated: boolean;
  role: UserRole;
  settings?: UserSettings;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    activateLink: { type: String },
    role: { type: String, required: true, default: UserRole.user },
    settings: {
      birthday: { type: String },
      phone: { type: String },
      city: { type: String },
      gender: { type: String },
      status: { type: String },
      avatar: { type: Number, min: 1, max: 12 },
    },
  },
  {
    timestamps: true,
  }
);
export default model("User", UserSchema);
