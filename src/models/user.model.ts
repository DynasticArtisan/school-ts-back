import { Document, model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export enum UserRole {
  user = "Пользователь",
  curator = "Куратор",
  teacher = "Преподаватель",
  admin = "Администратор",
  super = "Суперадминистратор",
}

export interface UserDocument extends Document {
  email: string;
  name: string;
  lastname: string;
  password: string;
  isActivated: boolean;
  role: UserRole;
  activationCode: string | null;
  passwordResetCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    activationCode: { type: String || null, default: null },
    passwordResetCode: { type: String || null, default: null },
    role: { type: String, required: true, default: UserRole.user },
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
  return next();
});

UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  const user = this as UserDocument;
  return await bcrypt.compare(password, user.password).catch((e) => false);
};

UserSchema.virtual("userinfo", {
  ref: "Userinfo",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

const UserModel = model("User", UserSchema);

export default UserModel;
