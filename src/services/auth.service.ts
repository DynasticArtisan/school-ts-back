import UserDto from "../dtos/user.dto";
import ApiError from "../exceptions/ApiError";
import userModel from "../models/user.model";
import mailService from "./mails.service";
import notificationService from "./notes.service";
import tokenService from "./token.service";
import config from "config";
import { v4 } from "uuid";
import { UserinfoDocument } from "../models/userinfo.model";

class AuthService {
  async registration(
    name: string,
    lastname: string,
    email: string,
    password: string
  ) {
    const PrevUser = await userModel.findOne({ email });
    if (PrevUser) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }

    const User = await userModel.create({
      name,
      lastname,
      email,
      password,
      activationCode: v4(),
    });

    try {
      const link = `${config.get("SITEURL")}/lk/activation/${User._id}/${
        User.activationCode
      }`;
      await mailService.sendActivationMail(email, link);
    } catch (e) {
      return "Не удалось отправить письмо для активации аккаунта";
    }

    return `На почтовый адресс ${email} отправлено письмо, для потверждения регистрации`;
  }

  async activate(userId: string, activationCode: string) {
    const User = await userModel.findOneAndUpdate(
      { _id: userId, activationCode, isActivated: false },
      { activationCode: null, isActivated: true }
    );
    if (!User) {
      throw ApiError.BadRequest("Некорректная ссылка для активации");
    }

    try {
      await notificationService.createNewUserNotes(userId, User);
    } catch (e) {
      console.log(e);
    }
    return true;
  }

  async login(email: string, password: string, remember: boolean) {
    const User = await userModel
      .findOne({ email })
      .populate<{ userinfo: UserinfoDocument }>("userinfo");
    if (!User) {
      throw ApiError.BadRequest("Неверный логин или пароль");
    }
    if (!User.isActivated) {
      throw ApiError.BadRequest("Необходимо подтверждение почтового адреса");
    }
    if (!(await User.comparePassword(password))) {
      throw ApiError.BadRequest("Неверный логин или пароль");
    }
    const { accessToken, refreshToken } = await tokenService.generateTokens(
      User._id,
      User.role,
      remember
    );
    return { user: new UserDto(User), accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.BadRequest("Невалидный токен");
    }
    const tokenData = tokenService.validateRefreshToken(refreshToken);
    if (!tokenData) {
      throw ApiError.BadRequest("Невалидный токен");
    }
    const session = await tokenService.findToken(refreshToken);
    if (!session) {
      throw ApiError.BadRequest("Невалидный токен");
    }
    const User = await userModel
      .findById(session.user)
      .populate<{ userinfo: UserinfoDocument }>("userinfo")
      .lean();
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    const tokens = await tokenService.generateTokens(
      User._id,
      User.role,
      session.remember
    );
    return { user: new UserDto(User), remember: session.remember, ...tokens };
  }

  async forgotPassword(email: string) {
    const message =
      "На указаный почтовый адрес отправлена ссылка, для восстановения пароля";
    const User = await userModel.findOne({ email });
    if (!User) {
      return message;
    }
    if (!User.isActivated) {
      return "Требуется подтверждение почтового адреса";
    }
    User.passwordResetCode = v4();
    await User.save();

    try {
      const link = `${config.get("SITEURL")}/lk/resetpassword/${User._id}/${
        User.passwordResetCode
      }`;
      await mailService.sendResetPasswordMail(email, link);
    } catch (e) {
      console.log(e);
    }
    return message;
  }

  async resetPassword(
    userId: string,
    passwordResetCode: string,
    password: string
  ) {
    const User = await userModel.findOneAndUpdate(
      { _id: userId, passwordResetCode },
      { password, passwordResetCode: null }
    );
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    return true;
  }
}

export default new AuthService();
