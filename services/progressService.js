const ApiError = require("../exceptions/ApiError");
const courseModel = require("../models/courseModel");
const lessonModel = require("../models/lessonModel");
const moduleModel = require("../models/moduleModel");

const UCProgressModel = require("../models/UCProgressModel");
const ULProgressModel = require("../models/ULProgressModel");
const UMProgressModel = require("../models/UMProgressModel");

class ProgressService {

    async unlockCourseToUser(courseId, userId){
        const Progress = await UCProgressModel.findOne({ course: courseId, user: userId })
        if(Progress){ 
            throw ApiError.BadRequest("Курс уже доступен пользователю")
        }
        const Course = await courseModel.findById(courseId)
        if(!Course){
            throw ApiError.BadRequest('Курс не найден')
        }
        const CourseProgress = await UCProgressModel.create({ user: userId, course: courseId })
        const FirstModule = await moduleModel.findOne({ course: courseId, firstModule: true })
        if(FirstModule){
            await this.unlockModuleToUser(userId, FirstModule)
        }
        return CourseProgress
    }

    async unlockModuleToUser(userId, Module){
        const Progress = await UMProgressModel.findOne({ module: Module._id, user: userId })
        if(Progress){
            throw ApiError.BadRequest("Модуль уже доступен пользователю")
        }
        await UMProgressModel.create({ course: Module.course, module: Module._id, user: userId })
        const FirstLesson = await lessonModel.findOne({ module: Module._id, firstLesson: true })
        if(FirstLesson){
            await this.unlockLessonToUser(userId, FirstLesson )
        }
        return { message: "Доступ к модулю открыт" }    
    }

    async unlockLessonToUser(userId, Lesson){
        const Progress = await ULProgressModel.findOne({ lesson: Lesson._id, user: userId })
        if(Progress){
            throw ApiError.BadRequest("Урок уже доступен пользователю")
        }
        await ULProgressModel.create({ course: Lesson.course, module: Lesson.module, lesson: Lesson._id, user: userId })
        return { message: "Доступ к уроку открыт" }
    }

    async completeLesson(lessonId, userId){
        const LessonProgress = await ULProgressModel.findOneAndUpdate({ lesson: lessonId, user: userId }, { isCompleted: true }, { new: true }).populate({
            path: 'lesson',
            model: 'Lessons'
        })
        if(!LessonProgress){
            throw ApiError.BadRequest('Урок или пользователь не найден')
        }
        const NextLesson = await lessonModel.findOne({ prevLesson: lessonId })
        if(NextLesson){
            return this.unlockLessonToUser(userId, NextLesson)
        }
        else {
            return this.completeModule(LessonProgress.lesson.module, userId)
        }
    }

    async completeModule(moduleId, userId){    
        const ModuleProgress = await UMProgressModel.findOneAndUpdate({ module: moduleId, user: userId }, { isCompleted: true },{ new:true }).populate({
            path: 'module',
            model: 'Modules'
        })
        if(!ModuleProgress){
            throw ApiError.BadRequest('Модуль или пользователь не найден')
        }
        const NextModule = await moduleModel.findOne({ prevModule: moduleId })
        if(NextModule){
            return this.unlockModuleToUser(userId, NextModule)
        } else {
            return this.completeCourse(ModuleProgress.module.course, userId)
        }        
    }

    async completeCourse(courseId, userId){
        const CourseProgress = await UCProgressModel.findOneAndUpdate({ course: courseId, user: userId }, { isCompleted: true }, { new: true })
        if(!CourseProgress){
            throw ApiError.BadRequest('Курс или пользователь не найден')
        }
        return { message: 'Курс завершен' }
    }

}

module.exports = new ProgressService()