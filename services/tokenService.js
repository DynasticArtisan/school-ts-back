const jwt = require('jsonwebtoken');
const config = require("config");

const tokenModel = require('../models/tokenModel');

class TokenService {
    async generateTokens(payload){
        const accessToken = await jwt.sign(payload, config.get('JwtAccessSecret'), { expiresIn: '30m' });
        const refreshToken = await jwt.sign(payload, config.get('JwtRefreshSecret'), { expiresIn: '30d' });
        return {
            accessToken, refreshToken
        }
    }
    async validateAccessToken(token){
        try {
            const userData = jwt.verify(token, config.get("JwtAccessSecret"));
            return userData;
        } catch (e) {
            return null
        }
    }
    async validateRefreshToken(token){
        try {
            const userData = jwt.verify(token, config.get("JwtRefreshSecret"));
            return userData;
        } catch (e) {
            return null
        }
    }
    async saveToken(userId, refreshToken){
        const tokenData = await tokenModel.findOne({ user: userId })
        if(tokenData){
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({ user:userId, refreshToken });
        return token;
    }
    async findToken(refreshToken){
        const tokenData = tokenModel.findOne({ refreshToken });
        return tokenData;        
    }
    async removeToken(refreshToken){
        const tokenData = tokenModel.deleteOne({ refreshToken });
        return tokenData;
    }





    async generateResetToken(payload, password){
        const resetToken = await jwt.sign(payload, config.get('JwtAccessSecret')+password, { expiresIn: '10m' });
        return resetToken
    }
    async validateResetToken(token, password){
        try {
            const userData = jwt.verify(token, config.get("JwtAccessSecret")+password);
            return userData;
        } catch (e) {
            return null
        }
    }

}

module.exports = new TokenService()