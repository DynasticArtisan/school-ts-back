const notificationsService = require("../services/notificationsService");

class NotificationController{
    async createUserNotification(req, res, next){
        try {
            const { userId } = req.params;
            const { notification } = req.body;
            const notificationData = await notificationsService.createNotification(userId, notification)
            res.json(notificationData)
        } catch (e) {
            next(e)
        }
    }
    async getUserNotifications(req,res,next){
        try {
            const user = req.user;
            const notificationsData = await notificationsService.getUserNotifications( user.id )
            res.json(notificationsData)
        } catch (e) {
            next(e)
        }
    }

    async checkNewNotifications(req,res,next){
        try {
            const user = req.user;
            const newNotifications = await notificationsService.checkNewNotifications( user.id )
            res.json(newNotifications)
        } catch (e) {
            next(e)
        }
    }

}
module.exports = new NotificationController()