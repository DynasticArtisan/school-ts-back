const ApiError = require("../../exceptions/ApiError");
const notificationsModel = require("../../models/notifications/notificationsModel")
const templatesModel = require("../../models/notifications/templatesModel");
const replacer = require("../../utils/replacer");

class NotifService {


    async getAllNotifs(){
        return await notificationsModel.find()
    }
    
    
    async checkNewUserNotifs(user){
        return await notificationsModel.findOne({ user, readed: false }).count()
    }
    async getUserNotifs(user){
        const notifs = await notificationsModel.find({ user })
        notificationsModel.updateMany({user, readed: false}, {readed: true})
        return notifs
    }
    async deleteNotif(id){
        return await notificationsModel.findByIdAndDelete(id)
    }

    async createCustomNotif(id, user){
        const Template = await templatesModel.findById(id)
        if(!Template){
            throw ApiError.BadRequest(`Шаблон уведомления не найден`);
        }
        const { title, image, body } = Template
        return await notificationsModel.create({ user, title, image, body })
    }
    async createManyCustomNotif(id, users){
        const Template = await templatesModel.findById(id)
        if(!Template){
            throw ApiError.BadRequest(`Шаблон уведомления не найден`);
        }
        const { title, image, body } = Template
        return await notificationsModel.create(users.map(user => ({ user, title, image, body })))
    }

    // ДЗ на проверке
    async createHomeworkWaitNotif(user, lesson){
        const Template = await templatesModel.findOne({ type: "hw-wait" })
        if(!Template){
            throw ApiError.BadRequest(`Шаблон уведомления не найден`);
        }
        const { title, image, body } = Template
        return await notificationsModel.create({ user, title, image, body: replacer(body, { lesson }) })
    }

    // Доступ к курсу
    async createCourseLockNotif(user, course){
        const Template = await templatesModel.findOne({ type: "course-lock" })
        if(!Template){
            throw ApiError.BadRequest(`Шаблон уведомления не найден`);
        }
        const { title, image, body } = Template
        return await notificationsModel.create({ user, title, image, body: replacer(body, { course }) })
    }
    async createCourseUnlockNotif(user, course){
        const Template = await templatesModel.findOne({ type: "course-unlock" })
        if(!Template){
            throw ApiError.BadRequest(`Шаблон уведомления не найден`);
        }
        const { title, image, body } = Template
        return await notificationsModel.create({ user, title, image, body: replacer(body, { course }) })
    }








}

module.exports = new NotifService()