import UserDto, { UserinfoDto } from "../dtos/user.dto";
import ApiError from "../exceptions/ApiError";
import userModel from "../models/user.model";
import UserinfoModel, {
  UserinfoDocument,
  UserinfoInput,
} from "../models/userinfo.model";

class UserService {
  async getUsers() {
    const Users = await userModel.find().sort("-createdAt");
    return Users.map((user) => new UserDto(user));
  }

  async getUsersArray(userIds: string[]) {
    return await userModel.find({ _id: userIds });
  }

  async getUser(userId: string) {
    const User = await userModel.findById(userId);
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    return User;
  }

  async getUserProfile(user: string) {
    const User = await userModel
      .findById(user)
      .populate<{ userinfo: UserinfoDocument }>("userinfo");
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    return new UserDto(User);
  }

  async updateUser(userId: string, name: string, lastname: string) {
    const User = await userModel.findByIdAndUpdate(
      userId,
      { name, lastname },
      {
        new: true,
      }
    );
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    return new UserDto(User);
  }

  async updateUserinfo(user: string, userinfo: UserinfoInput) {
    let UserInfo = await UserinfoModel.findOneAndUpdate({ user }, userinfo, {
      new: true,
    });
    if (!UserInfo) {
      UserInfo = await UserinfoModel.create({ user, ...userinfo });
    }
    return new UserinfoDto(UserInfo);
  }

  async updatePassword(userId: string, password: string, newPassword: string) {
    const User = await userModel.findById(userId);
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    if (!(await User.comparePassword(password))) {
      throw ApiError.BadRequest("Неверный пароль");
    }
    User.password = newPassword;
    await User.save();
    return new UserDto(User);
  }

  async updateRole(userId: string, role: string) {
    const User = await userModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    return new UserDto(User);
  }

  async deleteUser(userId: string) {
    const User = await userModel.findByIdAndDelete(userId);
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    return User;
  }
}

export default new UserService();
