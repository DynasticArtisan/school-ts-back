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
        await notificationsModel.updateMany({user, readed: false}, {readed: true})
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

    // домашние задания
    async createHomeworkNotif(user, lesson, status){
        const Template = await templatesModel.findOne({ type: `hw-${status}` })
        if(!Template){
            throw ApiError.BadRequest(`Шаблон уведомления не найден`);
        }
        const { title, image, icon, body } = Template
        return await notificationsModel.create({ user, title, image, icon, body: replacer(body, { lesson }) })
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

    async createNewUserNotifs(user){
        const Templates = await templatesModel.find({ type: "new-user" })
        if(!Templates.length){
            throw ApiError.BadRequest(`Шаблон уведомления не найден`);
        }
        const notifs = Templates.map(({ title, image, icon, body }) => ({ user: user.id , title, image, icon, body: replacer(body, { user })}))
        return await notificationsModel.create(notifs)
    }






}

module.exports = new NotifService()