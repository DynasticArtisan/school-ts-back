import { Document, model, ObjectId, Schema } from "mongoose";

export interface UserinfoInput {
  birthday?: string;
  phone?: string;
  city?: string;
  gender?: string;
  status?: string;
  avatar?: number;
}

export interface UserinfoDocument extends UserinfoInput, Document {
  user: ObjectId;
}

const UserSchema = new Schema<UserinfoDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  birthday: { type: String },
  phone: { type: String },
  city: { type: String },
  gender: { type: String },
  status: { type: String },
  avatar: { type: Number, min: 1, max: 12 },
});

const UserinfoModel = model<UserinfoDocument>("Userinfo", UserSchema);

export default UserinfoModel;
