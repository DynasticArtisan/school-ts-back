import { ObjectId } from "mongoose";
import tokenModel from "src/models/tokenModel";

const { Schema } = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

export interface TokenUser {
  id: string;
  role: string;
  isActivated: boolean;
}

class TokenService {
  async saveToken(user: any, refreshToken: any) {
    const Token = await tokenModel.findOneAndUpdate({ user }, { refreshToken });
    if (!Token) {
      return await tokenModel.create({ user, refreshToken });
    }
    return Token;
  }
  async generateTokens(payload: any) {
    const accessToken = await jwt.sign(payload, config.get("JwtAccessSecret"), {
      expiresIn: "30m",
    });
    const refreshToken = await jwt.sign(
      payload,
      config.get("JwtRefreshSecret"),
      { expiresIn: "30d" }
    );
    return {
      accessToken,
      refreshToken,
    };
  }
  async generateResetToken(payload: any, password: any) {
    const resetToken = await jwt.sign(
      payload,
      config.get("JwtResetSecret") + password,
      { expiresIn: "10m" }
    );
    return resetToken;
  }
  async validateAccessToken(token: string): Promise<TokenUser | null> {
    try {
      return jwt.verify(token, config.get("JwtAccessSecret"));
    } catch (e) {
      return null;
    }
  }
  async validateRefreshToken(token: any) {
    try {
      return jwt.verify(token, config.get("JwtRefreshSecret"));
    } catch (e) {
      return null;
    }
  }
  async validateResetToken(token: any, password: any) {
    try {
      const userData = jwt.verify(
        token,
        config.get("JwtResetSecret") + password
      );
      return userData;
    } catch (e) {
      return null;
    }
  }
  async removeToken(refreshToken: any) {
    const tokenData = tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken: any) {
    const tokenData = await tokenModel.findOne({ refreshToken });
    return tokenData;
  }
  async deleteUserToken(user: any) {
    return await tokenModel.deleteMany({ user });
  }
}

export default new TokenService();
