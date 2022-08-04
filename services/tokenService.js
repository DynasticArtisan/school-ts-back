const config = require("config");
const jwt = require('jsonwebtoken');

const tokenModel = require('../models/tokenModel');

class TokenService {
    async saveToken(user, refreshToken){
        const Token = await tokenModel.findOneAndUpdate({ user }, { refreshToken })
        if(!Token){
            return await tokenModel.create({ user, refreshToken });
        }
        return Token;
    }
    async generateTokens(payload){
        const accessToken = await jwt.sign(payload, config.get('JwtAccessSecret'), { expiresIn: '30m' });
        const refreshToken = await jwt.sign(payload, config.get('JwtRefreshSecret'), { expiresIn: '30d' });
        return {
            accessToken, refreshToken
        }
    }
    async generateResetToken(payload, password){
        const resetToken = await jwt.sign(payload, config.get('JwtResetSecret')+password, { expiresIn: '10m' });
        return resetToken
    }
    async validateAccessToken(token){
        try {
            return jwt.verify(token, config.get("JwtAccessSecret"));
        } catch (e) {
            return null
        }
    }
    async validateRefreshToken(token){
        try {
            return jwt.verify(token, config.get("JwtRefreshSecret"));
        } catch (e) {
            return null
        }
    }
    async validateResetToken(token, password){
        try {
            const userData = jwt.verify(token, config.get("JwtResetSecret")+password);
            return userData;
        } catch (e) {
            return null
        }
    }
    async removeToken(refreshToken){
        const tokenData = tokenModel.deleteOne({ refreshToken });
        return tokenData;
    }

    async findToken(refreshToken){
        const tokenData = tokenModel.findOne({ refreshToken });
        return tokenData;        
    }
    async deleteUserToken(user){
        return await tokenModel.deleteMany({ user })
    }
}

module.exports = new TokenService()