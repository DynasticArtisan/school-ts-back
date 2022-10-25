import { ObjectId } from "mongoose";
import tokenModel from "../models/token.model";
import config from "config";
import jwt from "jsonwebtoken";
import TokenDto from "../dtos/token.dto";

class TokenService {
  generateTokens(data: TokenDto) {
    const accessToken = jwt.sign(data, config.get("JwtAccessSecret"), {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(data, config.get("JwtRefreshSecret"), {
      expiresIn: "15d",
    });
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

  generateResetToken(data: TokenDto, password: any): string {
    const resetToken = jwt.sign(data, config.get("JwtResetSecret") + password, {
      expiresIn: "10m",
    });
    return resetToken;
  }
  validateResetToken(token: string, password: string) {
    try {
      return jwt.verify(token, config.get("JwtResetSecret") + password);
    } catch (e) {
      return null;
    }
  }

  async saveToken(user: string, refreshToken: string) {
    const Token = await tokenModel.findOneAndUpdate({ user }, { refreshToken });
    if (!Token) {
      return await tokenModel.create({ user, refreshToken });
    }
    return Token;
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
