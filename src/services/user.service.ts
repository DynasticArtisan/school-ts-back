import UserDto, { UserinfoDto } from "../dtos/user.dto";
import ApiError from "../exceptions/ApiError";
import userModel, { UserRole } from "../models/user.model";
import UserinfoModel, {
  UserinfoDocument,
  UserinfoInput,
} from "../models/userinfo.model";

class UserService {
  async getUsers() {
    const Users = await userModel.find().sort("-createdAt");
    return Users.map((user) => new UserDto(user));
  }
  async getUser(user: string) {
    const User = await userModel.findById(user);
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    return User;
  }
  async getUsersArray(users: string[]) {
    return await userModel.find({ _id: users });
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

  async updateRole(user: string, role: string) {
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
  async updateUserinfo(user: string, userinfo: UserinfoInput) {
    const Userinfo = await UserinfoModel.findOneAndUpdate({ user }, userinfo, {
      new: true,
    });
    if (Userinfo) {
      return new UserinfoDto(Userinfo);
    }
    return await UserinfoModel.create({ user, ...userinfo });
  }
  async updatePassword(id: string, password: string, newPassword: string) {
    const User = await userModel.findById(id);
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

  async deleteUser(user: string) {
    const User = await userModel.findByIdAndDelete(user);
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    return User;
  }
}

export default new UserService();
