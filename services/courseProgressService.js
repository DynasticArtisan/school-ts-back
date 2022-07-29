const CourseProgressDto = require("../dtos/CourseProgressDto");
const ApiError = require("../exceptions/ApiError");

const courseProgressModel = require("../models/UCProgressModel");
const moduleProgressService = require("./moduleProgressService");
const modulesService = require("./modulesService");


class CourseProgressService {
    async createProgress({ user, course, format }) {
        const PrevProgress = await courseProgressModel.findOne({ user, course })
        if(PrevProgress){
            throw ApiError.BadRequest("Курс уже доступен пользователю")
        }
        const Progress = await courseProgressModel.create({ user, course, format, endAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) });
        const FirstModule = await modulesService.getFirstModule(course)
        await moduleProgressService.createProgress({ user, course, module: FirstModule.id }) 
        return new CourseProgressDto(Progress)
    }
    async getCourseProgresses(course){
        const Progresses = await courseProgressModel.find({ course }).populate([
            {
                path: 'user',
                select: 'name surname'
            },
            {
                path: 'lastLesson',
                populate: 'lesson module'
            }
        ]).lean()
        return Progresses.map(progress => new CourseProgressDto(progress))
    }

    async getProgress({ user, course }){
        const Progress = await courseProgressModel.findOne({ user, course })
        if(!Progress){
            throw ApiError.BadRequest('Прогресс пользователя не найден')
        }
        return new CourseProgressDto(Progress)
    }
    async getProgressById(id){
        const Progress = await courseProgressModel.findById(id)
        if(!Progress){
            throw ApiError.BadRequest('Прогресс пользователя не найден')
        }
        return new CourseProgressDto(Progress)
    }

    async updateProgress({ course, user }, payload){
        const Progress = await courseProgressModel.findOneAndUpdate({ course, user }, payload, { new: true })
        if(!Progress){
            throw ApiError.BadRequest('Прогресс пользователя не найден')
        }
        return new CourseProgressDto(Progress)
    }
    async completeProgress({ course, user }){
        const Progress = await courseProgressModel.findOneAndUpdate({ course, user }, { isCompleted: true }, { new: true })
        if(!Progress){
            throw ApiError.BadRequest('Прогресс пользователя не найден')
        }
        return new CourseProgressDto(Progress)
    }



}
module.exports = new CourseProgressService()