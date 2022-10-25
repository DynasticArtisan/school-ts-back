import UserDto from "../dtos/user.dto";
import ApiError from "../exceptions/ApiError";
import userModel from "../models/user.model";
import mailService from "./mail.service";
import notificationService from "./notification.service";
import tokenService from "./token.service";
import TokenDto from "../dtos/token.dto";
import config from "config";
const uuid = require("uuid");

class AuthService {
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
    const activateLink = uuid.v4();
    const User = await userModel.create({
      activateLink,
      name,
      surname,
      email,
      password,
    });
    try {
      await mailService.sendActivationMail(
        email,
        `${config.get("APIURL")}/api/auth/activate/${User._id}/${activateLink}`
      );
    } catch (e) {
      console.log(e);
    }
    return new UserDto(User);
  }
  async activate(activateLink: string) {
    const User = await userModel.findOneAndUpdate(
      { activateLink },
      { activateLink: null, isActivated: true }
    );
    if (!User) {
      throw ApiError.BadRequest("Некорректная ссылка для активации");
    }
    try {
      await notificationService.createNewUserNotifs(User._id, User);
    } catch (e) {
      console.log(e);
    }
    return new UserDto(User);
  }

  async login(email: string, password: string) {
    const User = await userModel.findOne({ email });
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    if (!User.isActivated) {
      throw ApiError.BadRequest("Необходимо подтверждение почтового адреса");
    }
    if (!User.comparePassword(password)) {
      throw ApiError.BadRequest("Неверный пароль");
    }
    const tokens = tokenService.generateTokens(new TokenDto(User));
    await tokenService.saveToken(User.id, tokens.refreshToken);
    return { ...tokens, user: new UserDto(User) };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.BadRequest("Невалидный токен");
    }
    const tokenData = tokenService.validateRefreshToken(refreshToken);
    const session = await tokenService.findToken(refreshToken);
    if (!tokenData) {
      throw ApiError.BadRequest("Невалидный токен");
    }
    if (!session) {
      throw ApiError.BadRequest("Токен перезаписан");
    }
    const User = await userModel.findById(session.user);
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    const tokens = tokenService.generateTokens(new TokenDto(User));
    await tokenService.saveToken(User.id, tokens.refreshToken);
    return { ...tokens, user: new UserDto(User) };
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
    User.passwordResetCode = uuid.v4();
    await User.save();
    console.log(User.passwordResetCode);
    return message;
  }

  async resetPassword(
    user: string,
    passwordResetCode: string,
    password: string
  ) {
    const User = await userModel.findOneAndUpdate(
      { _id: user, passwordResetCode },
      { password }
    );
    if (!User) {
      throw ApiError.Forbidden();
    }
    return "Пароль успешно изменен";
  }
}
export default new AuthService();
