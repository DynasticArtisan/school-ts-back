const notificationModel = require("../models/notificationModel")
const ApiError = require("../exceptions/ApiError")
const userModel = require("../models/userModel")

class NotificationsService {
    async createNotification(userId, notification){
        const User = await userModel.findById(userId)
        if(!User){
            throw ApiError.BadRequest("Пользователь не найден")
        }
        const Notification = await notificationModel.create({user: userId, ...notification })
        User.newNotifications = true;
        await User.save()
        return Notification
    }

    async getUserNotifications(userId){
        const User = await userModel.findById(userId)
        if(!User){
            throw ApiError.BadRequest("Пользователь не найден")
        }
        const Notifications = await notificationModel.find({ user: userId }).populate('lesson').populate('course')
        User.newNotifications = false;
        await User.save()
        return Notifications
    }

    async checkNewNotifications(userId){
        const User = await userModel.findById(userId)
        if(!User){
            throw ApiError.BadRequest("Пользователь не найден")
        }
        const { newNotifications } = User;
        return newNotifications
    }

}

module.exports = new NotificationsService()