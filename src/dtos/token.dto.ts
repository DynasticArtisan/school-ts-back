import { UserDocument, UserRole } from "../models/user.model";

export default class TokenDto {
  id: string;
  role: UserRole;
  constructor(model: UserDocument) {
    this.id = String(model._id);
    this.role = model.role;
  }
}
