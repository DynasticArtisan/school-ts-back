const res = require("express/lib/response");
const { SingleCourseProgressDto, UserCoursesProgressDto } = require("../dtos/progressDtos");
const ApiError = require("../exceptions/ApiError");
const courseModel = require("../models/courseModel");
const lessonModel = require("../models/lessonModel");
const moduleModel = require("../models/moduleModel");

const UCProgressModel = require("../models/UCProgressModel");
const ULProgressModel = require("../models/ULProgressModel");
const UMProgressModel = require("../models/UMProgressModel");

class ProgressService {
    // lessons progress
    async createULProgress(payload) {
        const ULProgress = await ULProgressModel.create(payload);
        return ULProgress
    }
    async getAllULProgress(){
        const ULProgress = await ULProgressModel.find();
        return ULProgress
    }
    async getOneULProgress(progressID){
        const ULProgress = await ULProgressModel.findById(progressID)
        return ULProgress
    }
    async updateULProgress(progressID, payload){
        const ULProgress = await ULProgressModel.findByIdAndUpdate(progressID, payload, { new: true })
        return ULProgress
    }
    async deleteULProgress(progressID){
        const ULProgress = await ULProgressModel.findByIdAndDelete(progressID)
        return ULProgress
    }
    async deleteAllULProgress(){
        const ULProgress = await ULProgressModel.deleteMany()
        return ULProgress
    }

    // modules progress
    async createUMProgress(payload) {
        const UMProgress = await UMProgressModel.create(payload);
        return UMProgress
    }    
    async getAllUMProgress(){
        const UMProgress = await UMProgressModel.find();
        return UMProgress
    }
    async getOneUMProgress(progressID){
        const UMProgress = await UMProgressModel.findById(progressID)
        if(!UMProgress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return UMProgress
    }
    async updateUMProgress(progressID, payload){
        const UMProgress = await UMProgressModel.findByIdAndUpdate(progressID, payload, { new: true })
        if(!UMProgress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return UMProgress
    }
    async deleteUMProgress(progressID){
        const UMProgress = await UMProgressModel.findByIdAndDelete(progressID)
        if(!UMProgress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return UMProgress
    }
    async deleteAllUMProgress(){
        const UMProgress = await UMProgressModel.deleteMany()
        return UMProgress
    }

    //courses progress
    async createUCProgress(payload) {
        const UCProgress = await UCProgressModel.create(payload);
        return UCProgress
    }
    async getAllUCProgress(){
        const UCProgress = await UCProgressModel.find()
        return UCProgress
    }
    async getOneUCProgress(progressID){
        const UCProgress = await UCProgressModel.find(progressID)
        if(!UCProgress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return UCProgress
    }
    async updateUCProgress(progressID, payload){
        const UCProgress = await UCProgressModel.findByIdAndUpdate(progressID, payload)
        if(!UCProgress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return UCProgress
    }
    async deleteUCProgress(progressID){
        const UCProgress = await UCProgressModel.findByIdAndDelete(progressID)
        if(!UCProgress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return UCProgress
    }
    async deleteAllUCProgress(){
        const UCProgress = await UCProgressModel.deleteMany()
        return UCProgress
    }



    async getAllUserProgressWithData(userId){
        const Courses = await UCProgressModel.find( { user: userId } ).select('course').populate({
            path: 'course',
            model: 'Courses',
            populate: {
                path: 'modules',
                model: 'Modules',
            }
        })
        return Courses
    }


    // getUserCourses
    async getUserCourses(userId){
        const UserCourses = await UCProgressModel.find({ user: userId }).select(['isCompleted', 'course']).populate({
            path: 'course',
            model: 'Courses',
            select: ['title', 'subtitle', 'urlname', 'image', 'totalLessons'],
            populate: 'totalLessons'
        }).lean()
        return UserCourses
    }
    async getUserCoursesWithProgress(userId){
        const UserCourses = await UCProgressModel.find({ user: userId, isAvailable: true }).select(['isCompleted', 'course', 'user', '-_id']).populate('totalCompleted').populate({
                    path: 'course',
                    model: 'Courses',
                    select: ['title', 'subtitle', 'urlname', 'image', 'totalLessons'],
                    populate: 'totalLessons'
            }).lean();
        const UserCoursesData = UserCourses.map(item => new UserCoursesProgressDto(item))
        return UserCoursesData;
    }
    async getOneUserCourseProgress(userId, courseId){
        const CourseData = await courseModel.findById(courseId).populate({
            path: 'modules',
            model: 'Modules',
            select: 'title description -course',
            populate: [
                {
                    path: 'progress',
                    match: {
                        user: userId
                    },
                    select: 'isCompleted -module -_id'
                },
                {
                    path: 'lessons',
                    select: 'title -module',
                    populate: {
                        path: 'progress',
                        match: {
                            user: userId
                        },
                        select: 'isCompleted -lesson -_id'
                    }
                }
            ]
        }).lean()
        return CourseData
    }



    // getCourseProgressesWithUsers
    async getUsersProgressesByCourse(courseId){
        const Progress = await UCProgressModel.find({ course: courseId }).select('course createdAt isCompleted format').populate([
            {
                path: "user",
                select: '-_id name surname'
            },
            {
                path: 'lastLesson',
                options: {
                    sort: '-createdAt'
                },
                select: '-_id -course user lesson module',
                populate: [
                    {
                        path: 'lesson',
                        select: '-_id title',
                    },
                    {
                        path: 'module',
                        select: '-_id title',
                    }
                ]      
            }
        ]).lean()

        const ProgressData = Progress.map(item => new SingleCourseProgressDto(item))
        
        return ProgressData

    }



    // Manage User Access
    async unlockCourseToUser(courseId, userId){
        const Progress = await UCProgressModel.findOne({ course: courseId, user: userId })
        if(Progress){ 
            throw ApiError.BadRequest("Курс уже доступен пользователю")
        }
        const Course = await courseModel.findById(courseId)
        if(!Course){
            throw ApiError.BadRequest('Курс не найден')
        }
        await UCProgressModel.create({ user: userId, course: courseId })
        const FirstModule = await moduleModel.findOne({ course: courseId, firstModule: true })
        if(FirstModule){
            await this.unlockModuleToUser(userId, FirstModule)
        }
        return { message: "Доступ к уроку открыт" }       
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