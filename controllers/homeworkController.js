const ApiError = require("../exceptions/ApiError")
const fileService = require("../services/fileService")
const homeworkService = require("../services/homeworkService");
const coursesService = require("../services/coursesService");
const roles = require("../utils/roles");
const statuses = require("../utils/statuses");
const lessonProgressService = require("../services/lessonProgressService");
const progressService = require("../services/progressService");

class HomeworkController {
    async createNewHomework(req, res, next){
        try {
            const { role, id:user } = req.user;
            const { exercise } = req.body;
            if(role === roles.user){
                if(!req.file){
                    throw ApiError.BadRequest("Ошибка в записи файла")
                }
                const Homework = await homeworkService.createHomework({ exercise, user });
                const File = await fileService.createHomeworkFile({ homework: Homework.id, filename: req.file.originalname, filepath: 'homeworks/'+req.file.filename });
                res.json({...Homework, files: [File]})
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async getAllHomeworks(req, res, next){
        try {
            const Homeworks = await homeworkService.readAllHomeworks(req.query)
            res.json(Homeworks)     
        } catch (e) {
            next(e)
        }

    }
    async getOneHomework(req, res, next){
        try {
            const { id } = req.params;
            const { role, id: user } = req.user;
            if(role === roles.super){
                const Homework = await homeworkService.getOneHomework(id)
                res.json(Homework)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async updateHomework(req, res, next){
        try {
            const { id } = req.params;
            const Homework = await homeworkService.updateHomework(id, req.body)
            res.json(Homework)
        } catch (e) {
            next(e)
        }
    }
    async deleteHomework(req, res, next){
        try {
            const { id } = req.params;
            const Homework = await homeworkService.deleteHomework(id)
            res.json("Домашнее задание удалено")
        } catch (e) {
            next(e)
        }
    }

    async uploadNewFile(req, res, next){
        try {
            const {id} = req.params;
            const { role, id: user} = req.user;
            if(role === roles.user){
                if(!req.file){
                    throw ApiError.BadRequest("Ошибка в записи файла")
                }
                const File = await fileService.createHomeworkFile({ homework:id, filename: req.file.originalname, filepath: 'homeworks/'+req.file.filename });
                if(!File){
                    throw ApiError.BadRequest("Ошибка в записи файла")
                }
                const Homework = await homeworkService.updateHomework( id, { status: "wait" } )
                res.json(Homework)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }

    async checkHomework(req, res, next){
        try {
            const {id} = req.params;
            const { role, id: user} = req.user;
            const { comment, status } = req.body;
            if(role === roles.super){
                const Homework = await homeworkService.checkHomework(id, { comment, status, checkBy: user })
                if(Homework.status === statuses.completed){
                    const Progress = await progressService.completeLesson(Homework.lesson, Homework.user.id )
                }
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