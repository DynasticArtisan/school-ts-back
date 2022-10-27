import { UserDocument, UserRole } from "../models/user.model";

export default class UserDto {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: UserRole;
  constructor(model: any) {
    this.id = model._id;
    this.name = model.name;
    this.lastname = model.lastname;
    this.email = model.email;
    this.role = model.role;
  }
}
