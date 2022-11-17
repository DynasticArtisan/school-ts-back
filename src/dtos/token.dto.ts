import { UserDocument, UserRole } from "../models/user.model";

export default class TokenDto {
  id: string;
  role: UserRole;
  remember: boolean;
  constructor(model: UserDocument, remember: boolean) {
    this.id = String(model._id);
    this.role = model.role;
    this.remember = remember;
  }
}
