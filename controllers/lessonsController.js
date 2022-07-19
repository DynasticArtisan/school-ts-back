const ApiError = require("../exceptions/ApiError")
const roles = require("../utils/roles")

const lessonsService = require("../services/lessonsService")
const lessonProgressService = require("../services/lessonProgressService")
const exerciseService = require("../services/exerciseService")
const modulesService = require("../services/modulesService")
const homeworkService = require("../services/homeworkService")

class LessonsController {
    async createLesson(req, res, next){
        try {
            const {role} = req.user;
            const lessonPayload = req.body;
            if(role === roles.super){
                const Module = await modulesService.getModule(lessonPayload.module)
                const Lesson = await lessonsService.createLesson({ ...lessonPayload, course: Module.course })
                if(lessonPayload.withHomework){
                    try {
                        const Exercise = await exerciseService.createExercise({
                            lesson: Lesson.id,
                            module: Lesson.module,
                            course: Lesson.course,
                            task: lessonPayload.homework
                        })
                        return res.json({...Lesson, exercise: Exercise.task })
                    } catch (error) {
                        return res.json({ ...Lesson, error: {message: "При создании домашнего задания произошла ошибка!", error }})
                    }
                }
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
                const Lesson = await lessonsService.getLessonProgress(id, user)
                res.json({ ...Lesson, progress: Progress })         
            }
            else if(role === roles.super){
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
                    const lessonData = await lessonsService.updateLesson(id, req.body)
                    if(req.body.withHomework){
                        try {
                            await exerciseService.updateExercise( lessonData._id, 
                                {
                                    module: lessonData.module,
                                    course: lessonData.course,
                                    task: req.body.homework
                                }
                            )
                        } catch (e) {
                            await exerciseService.createExercise({
                                lesson: lessonData._id,
                                module: lessonData.module,
                                course: lessonData.course,
                                task: req.body.homework
                            })
                        }
                    } else {
                        await exerciseService.deleteLessonExercise(lessonData._id)
                    }
                    res.json(lessonData)
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
                    await exerciseService.deleteLessonExercise(id)
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