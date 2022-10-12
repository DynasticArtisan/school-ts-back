const ApiError = require("../exceptions/ApiError");
const coursesService = require("../services/coursesService");
const lessonsService = require("../services/lessonsService");
const notifsService = require("../services/notifications/notifsService");
const templateService = require("../services/notifications/templateService");

class NotifController {
    async createTemplate(req, res, next){
        try {
            const { type, title, image, body } = req.body;
            const Template = await templateService.createTemplate({ title, image, body, type })
            res.json(Template)
        } catch (e) {
            next(e)
        }
    }
    async getAllTemplates(req, res, next){
        try {
            const Templates = await templateService.getAllTemplates()
            res.json(Templates)
        } catch (e) {
            next(e)            
        }
    }
    async updateTemplate(req, res, next){
        try {
            const {id} = req.params
            const { type, title, image, body } = req.body;
            const Template = await templateService.updateTemplate(id, { type, title, image, body })
            res.json(Template)
        } catch (e) {
            next(e)            
        }
    }
    async deleteTemplate(req, res, next){
        try {
            const {id} = req.params
            const Template = await templateService.deleteTemplate(id)
            res.json(Template)
        } catch (e) {
            next(e)            
        }
    }


    async getAllNotifs(req, res, next){
        try {
            const Notifs = await notifsService.getAllNotifs()
            res.json(Notifs)
        } catch (e) {
            next(e)
        }
    }

    async checkUserNotifs(req, res, next){
        try {
            const {id} = req.user;
            const Count = await notifsService.checkNewUserNotifs(id)
            res.json(Count)
        } catch (e) {
            next(e)
        }
    }

    async getUserNotifs(req, res, next){
        try {
            const {id} = req.user
            const Notifs = await notifsService.getUserNotifs(id)
            res.json(Notifs)
        } catch (e) {
            next(e)
        }
    }
    async deleteNotif(req, res, next){
        try {
            const { id } = req.params
            const Notif = await notifsService.deleteNotif(id)
            res.json(Notif)
        } catch (e) {
            next(e)
        }
    }



    async createCustomNotif(req, res, next){
        try {
            const { id, user } = req.body;
            const Notif = await notifsService.createCustomNotif(id, user)
            res.json(Notif)
        } catch (e) {
            next(e)
        }
    }
    async createManyCustomNotifs(req, res, next){
        try {
            const { id, users } = req.body;
            const Notif = await notifsService.createManyCustomNotif(id, users)
            res.json(Notif)
        } catch (e) {
            next(e)
        }
    }
    async createHWWaitNotif(req, res, next){
        try {
            const { user, lesson } = req.body;
            const Lesson = await lessonsService.getLesson(lesson)
            if(!Lesson){
                throw ApiError.BadRequest('Урок не найден')
            }
            const Notif = await notifsService.createHomeworkNotif(user, Lesson, 'wait')
            res.json(Notif)
        } catch (e) {
            next(e)
        }
    }
    async createCourseLockNotif(req, res, next){
        try {
            const { user, course } = req.body;
            const Course = await coursesService.getCourse(course)
            if(!Course){
                throw ApiError.BadRequest('Курс не найден')
            }
            const Notif = await notifsService.createCourseLockNotif(user, Course)
            res.json(Notif)
        } catch (e) {
            next(e)
        }
    }
    async createCourseUnlockNotif(req, res, next){
        try {
            const { user, course } = req.body;
            const Course = await coursesService.getCourse(course)
            if(!Course){
                throw ApiError.BadRequest('Курс не найден')
            }
            const Notif = await notifsService.createCourseUnlockNotif(user, Course)
            res.json(Notif)
        } catch (e) {
            next(e)
        }
    }

    async createNewUserNotif(req, res, next){
        try {
            const { id, name } = req.body
            const Notifs = await notifsService.createNewUserNotifs({id, name})
            res.json(Notifs)
        } catch (e) {
            next(e)
        }
    }


}

module.exports = new NotifController()