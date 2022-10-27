import { ObjectId } from "mongoose";
import UserDto from "../dtos/user.dto";
import ApiError from "../exceptions/ApiError";
import userModel, { UserDocument, UserRole } from "../models/user.model";
import UserinfoModel, { UserinfoInput } from "../models/userinfo.model";

class UserService {
  async getUsers() {
    const Users = await userModel.find();
    return Users.map((user) => new UserDto(user));
  }
  async getUserProfile(user: ObjectId | string) {
    const User = await userModel.findById(user);
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    return new UserDto(User);
  }
  async getUser(user: ObjectId | string) {
    const User = await userModel.findById(user);
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    return new UserDto(User);
  }
  async deleteUser(user: ObjectId | string) {
    const User = await userModel.findByIdAndDelete(user);
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    return User;
  }
  async setUserRole(user: string, role: UserRole) {
    const User = await userModel.findByIdAndUpdate(
      user,
      { role },
      { new: true }
    );
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    return new UserDto(User);
  }
  async updateUser(id: string, payload: { name: string; lastname: string }) {
    const User = await userModel.findByIdAndUpdate(id, payload, { new: true });
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    return new UserDto(User);
  }
  async updateUserinfo(user: string, payload: UserinfoInput) {
    const Userinfo = await UserinfoModel.findOneAndUpdate({ user }, payload, {
      new: true,
    });
    if (Userinfo) {
      return Userinfo;
    }
    return await UserinfoModel.create({ user, ...payload });
  }
  async updatePassword(id: string, password: string, newPassword: string) {
    const User = await userModel.findById(id);
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    if (!User.comparePassword(password)) {
      throw ApiError.BadRequest("Неверный пароль");
    }
    User.password = newPassword;
    await User.save();
    return new UserDto(User);
  }
}

export default new UserService();
