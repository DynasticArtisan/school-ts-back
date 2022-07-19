const ApiError = require("../exceptions/ApiError")
const roles = require("../utils/roles");
const statuses = require("../utils/statuses");

const fileService = require("../services/fileService")
const lessonProgressService = require("../services/lessonProgressService");
const homeworkService = require("../services/homeworkService");
const exerciseService = require("../services/exerciseService");

class HomeworkController {
    async createNewHomework(req, res, next){
        try {
            const { role, id: user } = req.user;
            const { lesson } = req.body;
            if(role === roles.user){
                if(!req.file){
                    throw ApiError.BadRequest("Ошибка в записи файла")
                }
                await lessonProgressService.getProgress(lesson, user)
                const Exercise = await exerciseService.getLessonExercise(lesson)
                const Homework = await homeworkService.createHomework({ user, lesson, course: Exercise.course, exercise: Exercise.id });
                const File = await fileService.createHomeworkFile({ homework: Homework.id, filename: req.file.originalname, filepath: 'homeworks/'+req.file.filename });
                res.json({...Homework, files: [File]})
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
    async updateHomework(req, res, next){
        try {
            const { id } = req.params;
            const { role, id: user} = req.user;
            if(role === roles.user){
                if(!req.file){
                    throw ApiError.BadRequest("Ошибка в записи файла")
                }
                const Homework = await homeworkService.updateHomework( id, { status: "wait" })
                const File = await fileService.createHomeworkFile({ homework:id, filename: req.file.originalname, filepath: 'homeworks/'+req.file.filename });
                res.json({...Homework, files: [File]})
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
                    const Progress = await lessonProgressService.completeProgress({ user: Homework.user.id, lesson: Homework.lesson })
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