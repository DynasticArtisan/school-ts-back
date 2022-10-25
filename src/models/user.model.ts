import { Document, model, Schema } from "mongoose";
import bcrypt from "bcrypt";
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

export interface UserDocument extends Document {
  email: string;
  name: string;
  surname: string;
  password: string;
  isActivated: boolean;
  role: UserRole;
  settings?: UserSettings;
  activateLink: string;
  passwordResetCode: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    activateLink: { type: String },
    passwordResetCode: { type: String || null, default: null },
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

UserSchema.pre("save", async function (next) {
  let user = this as UserDocument;
  if (!user.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  console.log(user.password);
  return next();
});

UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  const user = this as UserDocument;
  return await bcrypt.compare(password, user.password).catch((e) => false);
};

const UserModel = model("User", UserSchema);

export default UserModel;
