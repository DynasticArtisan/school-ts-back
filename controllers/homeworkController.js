const ApiError = require("../exceptions/ApiError")
const roles = require("../utils/roles");
const statuses = require("../utils/statuses");

const homeworkService = require("../services/homeworkService");
const courseMastersService = require("../services/courseMastersService");

class HomeworkController {
    async getHomework(req, res, next){
        try {
            const { id } = req.params;
            const { role, id: user } = req.user;
            if(role === roles.super){
                const Homework = await homeworkService.getHomework(id)
                res.json(Homework)
            } else if(role === roles.teacher || role === roles.curator){
                const Homework = await homeworkService.getHomework(id)
                await courseMastersService.getMaster({ user, course: Homework.course })
                res.json(Homework)

            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }

    async acceptHomework(req, res, next){
        try {
            const { id } = req.params;
            const { role, id: user } = req.user;
            const { comment } = req.body;
            if(role === roles.super){
                const Homework = await homeworkService.verifyHomework(id, { status: statuses.completed, comment }, user)
                await courseProgressService.completeLessonProgress({ user: Homework.user, lesson: Homework.lesson })
                res.json(Homework)
            } else if(role === roles.teacher || role === roles.curator){
                let Homework = await homeworkService.getHomework(id)
                await courseMastersService.getMaster({ user, course: Homework.course })
                Homework = await homeworkService.verifyHomework(id, { status: statuses.completed, comment }, user)
                await courseProgressService.completeLessonProgress({ user: Homework.user, lesson: Homework.lesson })
                res.json(Homework)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async rejectHomework(req, res, next){
        try {
            const { id } = req.params;
            const { role, id: user } = req.user;
            const { comment } = req.body;
            if(role === roles.super){
                const Homework = await homeworkService.verifyHomework(id, { status: statuses.failed, comment }, user)
                res.json(Homework)
            } else if(role === roles.teacher || role === roles.curator){
                let Homework = await homeworkService.getHomework(id)
                await courseMastersService.getMaster({ user, course: Homework.course })
                Homework = await homeworkService.verifyHomework(id, { status: statuses.failed, comment }, user)
                res.json(Homework)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }

}
module.exports = new HomeworkController()