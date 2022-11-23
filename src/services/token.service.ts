import tokenModel from "../models/token.model";
import config from "config";
import jwt, { sign } from "jsonwebtoken";
import { UserRole } from "../models/user.model";

class TokenService {
  async generateTokens(id: string, role: UserRole, remember: boolean) {
    const accessToken = sign({ id, role }, config.get("JwtAccessSecret"), {
      expiresIn: "15m",
    });
    const refreshToken = sign({ id, role }, config.get("JwtRefreshSecret"), {
      expiresIn: "15d",
    });
    const Token = await tokenModel.findOneAndUpdate(
      { user: id },
      { refreshToken, remember }
    );
    if (!Token) {
      await tokenModel.create({ user: id, refreshToken, remember });
    }
    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token: string) {
    try {
      return jwt.verify(token, config.get("JwtAccessSecret"));
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      return jwt.verify(token, config.get("JwtRefreshSecret"));
    } catch (e) {
      return null;
    }
  }

  async removeToken(refreshToken: string) {
    const tokenData = tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken: string) {
    const tokenData = await tokenModel.findOne({ refreshToken });
    return tokenData;
  }
}

export default new TokenService();
