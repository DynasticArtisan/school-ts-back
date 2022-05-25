const config = require("config");

const userService = require("../services/userService")

const ApiError = require("../exceptions/ApiError");


class UserController {
    // user controller
    async createUser(req, res, next) {
        try {
            const User = await userService.createUser(req.body)
            res.json(User)
        } catch (e) {
            next(e)
        }
    }
    async getAllUsers(req, res, next){
        try {
            const usersData = await userService.getAllUsers();
            res.json(usersData)
        } catch (e) {
            next(e)
        }       
    }
    async getOneUser(req, res,next){
        try {
            const { userId } = req.params;
            const userData = await userService.getOneUser(userId);
            res.json(userData);
        } catch (e) {
            next(e)
        }
    }
    async updateUser(req, res, next){
        try {
            const { userId } = req.params;
            const userData = await userService.updateUser(userId)
            res.json(userData);
        } catch (e) {
            next(e)
        }
    }
    async deleteUser(req, res, next){
        try {
            const { userId } = req.params;
            const userData = await userService.deleteUser(userId)
            res.json("Пользователь был удален");
        } catch (e) {
            next(e)
        }
    }




    async updateUserInfo(req, res, next){
        try {
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

    async changePassword(req, res, next){
        try {
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




    async updateUserRole(req, res, next){
        try {
            const { role } = req.body;
            const { userId } = req.params;
            // if(req.user.role !== 'super'){
            //     return next(ApiError.UnauthorizedError())
            // }
            const userData = await userService.updateUser(userId, { role })
            res.json(userData)
        } catch (e) {
            next(e)
        }

    }


    async getUsersList(req, res, next){
        try {
            const UsersList = await userService.getUsersList()
            res.json(UsersList)
        } catch (e) {
            next(e)
        }
    }




}
module.exports = new UserController()