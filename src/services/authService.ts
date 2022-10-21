import { ObjectId } from "mongoose";
import UserDto from "src/dtos/userDto";
import UserTokenDto from "src/dtos/UserTokenDto";
import ApiError from "src/exceptions/ApiError";
import userModel from "src/models/userModel";
import mailService from "./mailService";
import tokenService from "./tokenService";
import userService from "./userService";
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const config = require("config");

class AuthService {
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.BadRequest("Невалидный токен");
    }
    const userData = await tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken(refreshToken);
    if (!userData) {
      throw ApiError.BadRequest("Невалидный токен");
    }
    if (!tokenFromDB) {
      throw ApiError.BadRequest("Невалидный токен");
    }
    const User = await userService.getUser(userData.id);
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    const tokens = await tokenService.generateTokens({
      ...new UserTokenDto(User),
    });
    await tokenService.saveToken(User.id, tokens.refreshToken);
    return { ...tokens, user: new UserDto(User) };
  }

  async registration(
    name: string,
    surname: string,
    email: string,
    password: string
  ) {
    const PrevUser = await userModel.findOne({ email });
    if (PrevUser) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activateLink = uuid.v4();
    const User = await userModel.create({
      activateLink,
      name,
      surname,
      email,
      password: hashPassword,
    });
    await mailService.sendActivationMail(
      email,
      `${config.get("APIURL")}/api/auth/activate/${activateLink}`,
      name
    );
    return new UserDto(User);
  }

  async login(email: string, password: string) {
    const User = await userModel.findOne({ email, isActivated: true });
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    const isPassEquals = await bcrypt.compare(password, User.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Некорректный пароль");
    }
    const TokenDto = new UserTokenDto(User);
    const tokens = await tokenService.generateTokens({ ...TokenDto });
    await tokenService.saveToken(User.id, tokens.refreshToken);
    return { ...tokens, user: new UserDto(User) };
  }

  async activate(activateLink: string) {
    const User = await userModel.findOneAndUpdate(
      { activateLink },
      { activateLink: null, isActivated: true }
    );
    if (!User) {
      throw ApiError.BadRequest("Некорректная ссылка для активации");
    }
    return new UserDto(User);
  }

  async forgotPassword(email: string) {
    const User = await userModel.findOne({ email, isActivated: true });
    if (User) {
      const token = await tokenService.generateResetToken(
        { id: User.id, email: User.email },
        User.password
      );
      // await mailService.sendResetPasswordLink(email, `${config.get("APIURL")}/api/auth/reset-password/${User.id}/${token}`);
      console.log(
        `${config.get("APIURL")}/api/auth/reset-password/${User.id}/${token}`
      );
    }
    return true;
  }

  async getResetToken(id: string, token: string) {
    const User = await userModel.findById(id);
    if (!User) {
      throw ApiError.BadRequest("Пользователь не был найден"); //redirect to homepage
    }
    const tokenData = await tokenService.validateResetToken(
      token,
      User.password
    );
    if (!tokenData) {
      throw ApiError.UnauthorizedError(); //redirect to homepage
    }
    const resetToken = await tokenService.generateResetToken(
      { ...new UserTokenDto(User) },
      User.password
    );
    return resetToken;
  }

  async resetPassword(id: ObjectId, token: string, password: string) {
    const user = await userModel.findById(id);
    if (!user) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    const tokenData = await tokenService.validateResetToken(
      token,
      user.password
    );
    if (!tokenData) {
      throw ApiError.UnauthorizedError();
    }
    const hashPassword = await bcrypt.hash(password, 3);
    user.password = hashPassword;
    await user.save();
    return new UserDto(user);
  }
}
export default new AuthService();
