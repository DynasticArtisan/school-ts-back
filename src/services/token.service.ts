import { ObjectId } from "mongoose";
import TokenDto from "../dtos/token.dto";
import tokenModel from "../models/token.model";
import { UserRole } from "../models/user.model";
import config from "config";
import jwt from "jsonwebtoken";

export interface TokenUser extends jwt.JwtPayload {
  id: string;
  role: UserRole;
}

class TokenService {
  async generateTokens(data: TokenUser) {
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
  async generateResetToken(data: TokenUser, password: any) {
    const resetToken = jwt.sign(data, config.get("JwtResetSecret") + password, {
      expiresIn: "10m",
    });
    return resetToken;
  }
  validateAccessToken(token: string): TokenUser | null {
    try {
      return jwt.verify(token, config.get("JwtAccessSecret"));
    } catch (e) {
      return null;
    }
  }
  validateRefreshToken(token: string): TokenUser {
    try {
      return jwt.verify(token, config.get("JwtRefreshSecret"));
    } catch (e) {
      return null;
    }
  }
  async validateResetToken(token: string, password: string) {
    try {
      return jwt.verify(token, config.get("JwtResetSecret") + password);
    } catch (e) {
      return null;
    }
  }

  async saveToken(user: ObjectId | string, refreshToken: string) {
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
