const { validationResult } = require('express-validator');
const config = require("config");

const ApiError = require("../exceptions/ApiError");
const userService = require("../services/userService");
const tokenService = require("../services/tokenService");

class AuthController {
    async registration(req, res, next){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors))
            }
            const { name, surname, email, password } = req.body;
            const userData = await userService.registration( name, surname, email, password );
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
    async login(req, res, next){
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
    async getResetToken(req, res, next){
        try {
            const { id, token } = req.params;
            const resetToken = await userService.getResetToken(id, token);
            res.cookie('resetToken', resetToken, { maxAge:10*60*1000, httpOnly: true });
            res.redirect( config.get("ClientURL")+'/recover/'+id );
        } catch (e) {
            next(e);
        }
    }
    async resetPassword(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                next(ApiError.BadRequest('Ошибка при валидации', errors));
            }
            const { id, newPassword, confirmNewPassword } = req.body;
            if(newPassword != confirmNewPassword){
                next(ApiError.BadRequest('Пароли отличаются'));
            }   
            const { resetToken } = req.cookies;
            if(!resetToken){
                next(ApiError.UnauthorizedError());
            }
            const userData = await userService.passwordReset(id, resetToken, newPassword);
            res.clearCookie('resetToken');
            res.json(userData);
        } catch (e) {
            next(e);
        }
    }
    async logout(req, res, next){
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }
    async forgotPassword(req, res, next){
        try {
            const { email } = req.body;
            await userService.forgotPassword(email);
            return res.status(200).json({ message: "На указаную почту отправлено письмо" })
        } catch (error) {
            next(e);
        }
    }
    async activate(req, res, next){
        try {
            const activateLink = req.params.link;
            await userService.activate(activateLink);
            return res.redirect(config.get("ClientURL"));
        } catch (e) {
            next(e);
        }
    }
    async refresh(req, res, next){
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            if(!userData){
                next(ApiError.UnauthorizedError())
            }
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new AuthController()