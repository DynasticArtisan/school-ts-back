const ApiError = require("../exceptions/ApiError")
const roles = require("../utils/roles");
const statuses = require("../utils/statuses");

const fileService = require("../services/fileService")
const lessonProgressService = require("../services/lessonProgressService");
const homeworkService = require("../services/homeworkService");

class HomeworkController {
    async createNewHomework(req, res, next){
        try {
            const { role, id: user } = req.user;
            const { lesson } = req.body;
            const file = req.file;
            if(role === roles.user){
                if(!file){
                    throw ApiError.BadRequest("Ошибка в записи файла")
                }
                const Progress = await lessonProgressService.getProgress(lesson, user)
                const Homework = await homeworkService.createHomework({ user, lesson, course: Progress.course });
                const File = await fileService.createHomeworkFile({ homework: Homework.id, filename: file.originalname, filepath: 'homeworks/'+ file.filename });
                res.json({...Homework, files: [ File ]})
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }

    async updateHomework(req, res, next){
        try {
            const { lesson } = req.body;
            const { role, id: user} = req.user;
            const file = req.file;
            if(role === roles.user){
                if(!file){
                    throw ApiError.BadRequest("Ошибка в записи файла")
                }
                const Homework = await homeworkService.updateHomework({ lesson, user, status: statuses.failed }, { status: statuses.wait })
                const File = await fileService.createHomeworkFile({ Homework:id, filename: file.originalname, filepath: 'homeworks/'+ file.filename });
                res.json({...Homework, files: [ File ]})
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }

    async getHomework(req, res, next){
        try {
            const { id } = req.params;
            const { role, id: user } = req.user;
            if(role === roles.super){
                const Homework = await homeworkService.getHomework(id)
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
                await lessonProgressService.completeProgress({ user: Homework.user, lesson: Homework.lesson })
                res.json(Homework)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (error) {
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
            } else {
                next(ApiError.Forbidden())
            }
        } catch (error) {
            next(e)
        }
    }


}
module.exports = new HomeworkController()