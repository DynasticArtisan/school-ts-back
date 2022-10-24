import { ObjectId } from "mongoose";
import ApiError from "../exceptions/ApiError";
import userModel, { UserDocument, UserRole } from "../models/user.model";

const UserDto = require("../dtos/userDto");
const bcrypt = require("bcrypt");

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

  async setUserRole(user: ObjectId | string, role: UserRole) {
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

  async updateUser(id: ObjectId | string, payload: UserDocument) {
    const User = await userModel.findByIdAndUpdate(id, payload, { new: true });
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    return new UserDto(User);
  }

  async replacePassword(id: ObjectId, password: string, newPassword: string) {
    const User = await userModel.findById(id);
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    const isPassEquals = await bcrypt.compare(password, User.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Неверный пароль");
    }
    const hashPassword = await bcrypt.hash(newPassword, 3);
    User.password = hashPassword;
    await User.save();
    return new UserDto(User);
  }

  async updatePassword(id: ObjectId, password: string) {
    const hashPassword = await bcrypt.hash(password, 3);
    const User = await userModel.findByIdAndUpdate(id, {
      password: hashPassword,
    });
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    return User;
  }
}

export default new UserService();
