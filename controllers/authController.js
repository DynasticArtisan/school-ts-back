const config = require("config");
const ApiError = require("../exceptions/ApiError");

const userService = require("../services/userService");
const tokenService = require("../services/tokenService");

class AuthController {
    async refresh(req, res, next){
        try {
            const { refreshToken } = req.cookies;
            const { remember } = req.query;
            const User = await userService.refresh(refreshToken);
            if(remember){
                res.cookie('refreshToken', User.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true });
            } else {
                res.cookie('refreshToken', User.refreshToken, { httpOnly: true });
            }
            return res.json(User);
        } catch (e) {
            next(e);
        }
    }
    async registration(req, res, next){
        try {
            const { name, surname, email, password } = req.body;
            const User = await userService.registration( name, surname, email, password );
            // res.cookie('refreshToken', UserData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true });
            return res.json(User);
        } catch (e) {
            next(e);
        }
    }
    async login(req, res, next){
        try {
            const { email, password, remember } = req.body;
            const User = await userService.login(email, password);
            if(remember){
                res.cookie('refreshToken', User.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true });
            } else {
                res.cookie('refreshToken', User.refreshToken, { httpOnly: true });
            }
            return res.json(User);
        } catch (e) {
            next(e);
        }
    }
    async activate(req, res, next){
        try {
            const { link } = req.params;
            await userService.activate(link);
            return res.redirect(config.get("ClientURL"));
            // на страницу спасибо
        } catch (e) {
            next(e);
        }
    }
    async logout(req, res, next){
        try {
            const { refreshToken } = req.cookies;
            await tokenService.removeToken(refreshToken);
            res.clearCookie('refreshToken');
            res.send()
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
            const { id, newPassword } = req.body;
            const { resetToken } = req.cookies;
            if(!resetToken){
                next(ApiError.Forbidden());
            }
            const userData = await userService.resetPassword(id, resetToken, newPassword);
            res.clearCookie('resetToken');
            res.json(userData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new AuthController()