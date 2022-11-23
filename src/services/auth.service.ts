import UserDto from "../dtos/user.dto";
import ApiError from "../exceptions/ApiError";
import userModel from "../models/user.model";
import mailService from "./mail.service";
import notificationService from "./notification.service";
import tokenService from "./token.service";
import TokenDto from "../dtos/token.dto";
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
      activationCode: v4(),
      name,
      lastname,
      email,
      password,
    });
    const activationLink = `${config.get("SITEURL")}/lk/activation/${
      User._id
    }/${User.activationCode}`;
    try {
      await mailService.sendActivationMail(email, activationLink);
    } catch (e) {
      return "Не удалось отправить письмо для активации аккаунта";
    }
    return `На почтовый адресс ${email} отправлено письмо, для потверждения регистрации`;
  }
  async activate(user: string, activationCode: string) {
    const User = await userModel.findOneAndUpdate(
      { _id: user, activationCode },
      { activationCode: null, isActivated: true }
    );
    if (!User) {
      throw ApiError.BadRequest("Некорректная ссылка для активации");
    }
    try {
      await notificationService.createNewUserNotifs(User._id, User);
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
      throw ApiError.BadRequest("Пользователь не найден");
    }
    if (!User.isActivated) {
      throw ApiError.BadRequest("Необходимо подтверждение почтового адреса");
    }
    if (!(await User.comparePassword(password))) {
      throw ApiError.BadRequest("Неверный пароль");
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
      throw ApiError.BadRequest("Токен перезаписан");
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
    const passwordResetLink = `${config.get("SITEURL")}/lk/resetpassword/${
      User._id
    }/${User.passwordResetCode}`;
    try {
      await mailService.sendResetPasswordMail(email, passwordResetLink);
    } catch (e) {
      console.log(e);
      throw ApiError.BadRequest("Не удалось отпрваить письмо");
    }
    return message;
  }
  async resetPassword(
    user: string,
    passwordResetCode: string,
    password: string
  ) {
    const User = await userModel.findOne({ _id: user, passwordResetCode });
    if (!User) {
      throw ApiError.Forbidden();
    }
    User.password = password;
    User.passwordResetCode = null;
    await User.save();
    return "Пароль успешно изменен";
  }
}
export default new AuthService();
