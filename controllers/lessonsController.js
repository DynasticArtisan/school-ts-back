const ApiError = require("../exceptions/ApiError")
const roles = require("../utils/roles")

const lessonsService = require("../services/lessonsService")
const lessonProgressService = require("../services/lessonProgressService")
const modulesService = require("../services/modulesService")
const homeworkService = require("../services/homeworkService")
const courseMastersService = require("../services/courseMastersService")

class LessonsController {
    async createLesson(req, res, next){
        try {
            const {role} = req.user;
            const lessonPayload = req.body;
            if(role === roles.super){
                const Module = await modulesService.getModule(lessonPayload.module)
                const Lesson = await lessonsService.createLesson({ ...lessonPayload, course: Module.course })
                res.json(Lesson)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    
    async getLesson(req, res, next){
        try {
            const {id} = req.params;
            const {role, id: user} = req.user;
            if(role === roles.user){
                const Progress = await lessonProgressService.getProgress(id, user)
                const Lesson = await lessonsService.getLesson(id)
                res.json({ ...Lesson, progress: Progress })         
            } else if(role === roles.teacher || role === roles.curator){
                const Lesson = await lessonsService.getLesson(id)
                const Master = await courseMastersService.getMaster({ user, course: Lesson.course })
                res.json(Lesson)
            } else if(role === roles.super){
                const Lesson = await lessonsService.getLesson(id)
                res.json(Lesson)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async getLessonHomeworks(req, res, next){
        try {
                const {id} = req.params;
                const {role, id: user} = req.user;
                if(role === roles.super){
                    const Lesson = await lessonsService.getLesson(id)
                    const Homeworks = await homeworkService.getLessonHomeworks(id)
                    res.json({ ...Lesson, homeworks: Homeworks })
                } else if(role === roles.teacher || role === roles.curator){
                    const Lesson = await lessonsService.getLesson(id)
                    await courseMastersService.getMaster({ user, course: Lesson.course })
                    const Homeworks = await homeworkService.getLessonHomeworks(id)
                    res.json({ ...Lesson, homeworks: Homeworks })
                } else {
                    next(ApiError.Forbidden())
                }
            } catch (e) {
                next(e)
            }
    }
    async updateLesson(req, res, next){
        try {
            const {role} = req.user;
            const { id } = req.params;
            if(role === roles.super){
                const Lesson = await lessonsService.updateLesson(id, req.body)
                res.json(Lesson)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }

    async createHomework(req, res, next){
        try {
            const { id: lesson } = req.params;
            const { role, id: user } = req.user;
            const file = req.file;
            if(role === roles.user){
                if(!file){
                    throw ApiError.BadRequest("Ошибка в записи файла")
                }
                const Progress = await lessonProgressService.getProgress(lesson, user)
                const Homework = await homeworkService.createHomework({ user, lesson, course: Progress.course }, { filename: file.originalname, filepath: 'homeworks/'+ file.filename });
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
            const { id:lesson } = req.params;
            const { role, id: user} = req.user;
            const file = req.file;
            if(role === roles.user){
                if(!file){
                    throw ApiError.BadRequest("Ошибка в записи файла")
                }
                const Homework = await homeworkService.updateHomework({ lesson, user, status: statuses.failed }, { status: statuses.wait }, {filename: file.originalname, filepath: 'homeworks/'+ file.filename })
                res.json(Homework)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }


    async completeLesson(req, res, next){
        try {
            const { id: lesson } = req.params;
            const { role, id: user } = req.user;
            if(role === roles.user) {
                const Progress = await lessonProgressService.completeProgress({ lesson, user })
                res.json(Progress)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (error) {
            
        }
    }

    async deleteLesson(req, res, next){
        try {
                const {role} = req.user;
                const { id } = req.params;
                if(role === roles.super){
                    await lessonsService.deleteLesson(id)
                    res.json({message:"Запись об уроке удалена"})
                } else {
                    next(ApiError.Forbidden())
                }
        } catch (e) {
            next(e)
        }
    }
    async dropAllLessons(req,res,next){
        try {
            const data = await lessonsService.dropAllLessons()
            res.json(data)
        } catch (e) {
            next(e)
        }
    }


}
module.exports = new LessonsController()