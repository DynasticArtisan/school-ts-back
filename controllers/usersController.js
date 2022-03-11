const { validationResult } = require('express-validator');
const config = require("config");

const userService = require("../services/userService")
const validate = require("../utils/validate");
const ApiError = require("../exceptions/ApiError");


class UserController {
    async getUsers(req, res, next){
        try {
            const usersData = await userService.getAllUsers();
            res.json(usersData)
        } catch (e) {
            next(e)
        }       
    }
    async getOneUser(req, res,next){
        try {
            const { id } = req.params;
            const userData = await userService.getOneUser(id);
            res.json(userData);
        } catch (e) {
            next(e)
        }
    }
    async changePassword(req, res, next){
        try {
            validate(req);
            const { password, newPassword, confirmNewPassword } = req.body;
            if(newPassword != confirmNewPassword){
                return next( ApiError.BadRequest('Пароли не совпадают') );
            }
            const userData = await userService.changePassword(req.user.id, password, newPassword);
            res.json(userData);
        } catch (e) {
            next(e)
        }
    }
    

    async updateNotoficationSettings(req, res, next){
        try {
            const { courseNotif, lessonsNotif, actionsNotif } = req.body;
            const userData = await userService.updateNotificationSettings( req.user.id, courseNotif, lessonsNotif, actionsNotif )
            res.json(userData)
        } catch (e) {
            next(e)
        }
    }
    async updateUserInfo(req, res, next){
        try {
            if(req.files && !req.file){
                return next(ApiError.BadRequest("Ошибка записи файла"));
            }
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors))
            }
            const userId = req.user.id;
            const data = req.body;
            if(req.file){
                data.avatar = `${config.get("APIURL")}/images/${req.file.filename}`;
            }
            const userData = await userService.updateUserInfo(userId, data);
            res.json(userData);
        } catch (e) {
            next(e)
        }


    }
    async uploadUserAvatar(req, res, next){
        try {
            if(!req.file){
                return next(ApiError.BadRequest("Ошибка записи файла"));
            }
            const userData = await userService.uploadUserAvatar(req.user.id, req.file.filename);
            res.json(userData)
        } catch (e) {
            next(e)
        }
    }
    async removeUserAvatar(req, res, next){
        try {
            const userData = await userService.removeUserAvatar(req.user.id);
            res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async changeUserRole(req, res, next){
        try {
            const { id, role } = req.body;
            if(req.user.role != 'super'){
                return next(ApiError.UnauthorizedError())
            }
            const userData = await userService.changeRole(id, role)
            res.json(userData)
        } catch (e) {
            next(e)
        }

    }
}
module.exports = new UserController()