const ApiError = require("../exceptions/ApiError")
const userModel = require("../models/userModel");
const homeworkNotificationModel = require("../models/homeworkNotificationModel");

class NotificationsService {
    async createHomeworkNotification(userId, homeworkId){
        const Notification = await homeworkNotificationModel.create({ user: userId, homework: homeworkId })
        if(Notification){
            const User = await userModel.findByIdAndUpdate(userId, { newNotifications: true })
        }
        return Notification
    }

    async getUserNotifications(userId){
        const User = await userModel.findByIdAndUpdate(userId, { newNotifications: false  })
        if(!User){
            throw ApiError.BadRequest("Пользователь не найден")
        }
        const HomeworkNotifications = await homeworkNotificationModel.find({ user: userId }).populate('lesson').populate('course')
        return HomeworkNotifications
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