import { Date } from "mongoose";
import { UserRole } from "../models/user.model";

export class UserinfoDto {
  birthday: string;
  phone: string;
  city: string;
  gender: string;
  status: string;
  avatar: number;
  constructor(model: any) {
    this.birthday = model.birthday;
    this.phone = model.phone;
    this.city = model.city;
    this.gender = model.gender;
    this.status = model.status;
    this.avatar = model.avatar;
  }
}

export default class UserDto {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: UserRole;
  userinfo?: UserinfoDto;
  registryAt: Date;
  constructor(model: any) {
    this.id = model._id;
    this.name = model.name;
    this.lastname = model.lastname;
    this.email = model.email;
    this.role = model.role;
    if (model.userinfo) {
      this.userinfo = new UserinfoDto(model.userinfo);
    }
    this.registryAt = model.createdAt;
  }
}
