const ApiError = require("../exceptions/ApiError");
const userService = require("../services/userService")
const notificationsService = require("../services/notificationsService");
const coursesService = require("../services/coursesService");
const progressService = require("../services/progressService");

class UserController {
    async getProfile(req, res,next){
        try {
            const { id } = req.user;
            const userData = await userService.getOneUser(id);
            res.json(userData);
        } catch (e) {
            next(e)
        }
    }

    async updateProfile(req, res, next){
        try {
            const { id } = req.user;
            const data = req.body;
            const userData = await userService.updateUserInfo(id, data);
            res.json(userData);
        } catch (e) {
            next(e)
        }
    }

    async uploadAvatar(req, res, next){
        try {
            const { id } = req.user;
            const { filename } = req.file;
            if(!req.file){
                return next(ApiError.BadRequest("Ошибка записи файла"));
            }
            const userData = await userService.uploadUserAvatar(id, 'avatars/'+filename);
            res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async removeAvatar(req, res, next){
        try {
            const { id } = req.user;
            const userData = await userService.removeUserAvatar(id);
            res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async changePassword(req, res, next){
        try {
            const { id } = req.user;
            const { password, newPassword } = req.body;
            const userData = await userService.changePassword(id, password, newPassword);
            res.json(userData);
        } catch (e) {
            next(e)
        }
    }

    // NOTIFICATIONS

    async updateNotificationsSettings(req, res, next){
        try {
            const { id } = req.user;
            const { courseNotif, lessonsNotif, actionsNotif } = req.body;
            const userData = await userService.updateNotificationSettings( id, courseNotif, lessonsNotif, actionsNotif )
            res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getNotifications(req, res, next){
        try {
            const { id } = req.user;
            const notificationsData = await notificationsService.getUserNotifications( id )
            res.json(notificationsData)
        } catch (e) {
            next(e)
        }
    }

    async checkNewNotifications(req, res, next){
        try {
            const { id } = req.user;
            const newNotifications = await notificationsService.checkNewNotifications( id )
            res.json(newNotifications)
        } catch (e) {
            next(e)
        }
    }
}
module.exports = new UserController()