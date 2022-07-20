const CourseProgressDto = require("../dtos/CourseProgressDto");
const { AdminCoursesProgressDto, UserCoursesProgressDto, CourseStudentDto, UserSingleCourseProgressDto, UserCourseDto } = require("../dtos/progressDtos");
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
        const Progress = await courseProgressModel.create({ user, course, format });
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
    async updateProgress(progress, payload){
        const Progress = await courseProgressModel.findByIdAndUpdate(progress, payload, { new: true })
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




    

    async getAllProgresses(){
        const Progresses = await courseProgressModel.find()
        return Progresses
    }
    async getOneProgress(progressID){
        const Progress = await courseProgressModel.find(progressID)
        if(!UCProgress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return Progress
    }

    async deleteProgress(progressID){
        const Progress = await courseProgressModel.findByIdAndDelete(progressID)
        if(!UCProgress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return Progress
    }

    async deleteAllProgresses(){
        const Progresses = await courseProgressModel.deleteMany()
        return Progresses
    }

    async getSingleUserProgresses(user){
        const UserCourses = await courseProgressModel.find({ user, isAvailable: true }).select(['isCompleted', 'course', 'user', '-_id']).populate('totalCompleted').populate({
                    path: 'course',
                    model: 'Courses',
                    select: 'title subtitle urlname image totalLessons',
                    populate: {
                        path: 'totalLessons'
                    }
            }).lean();
        const UserCoursesData = UserCourses.map(item => new UserCoursesProgressDto(item))
        return UserCoursesData;
    }

    async getCourseModulesProgress(userId, courseId){
        const UserProgress = await courseProgressModel.findOne({ user: userId, course: courseId, isAvailable: true }).populate({
            path: 'course',
            populate: {
                path: 'modules',
                populate: {
                    path: 'progress',
                    select: 'isCompleted -_id'
                }
            },
        }).lean();
        if(!UserProgress){
            throw ApiError.BadRequest('Нет доступа к курсу')
        }
        const UserProgressData = new UserSingleCourseProgressDto(UserProgress)
        return UserProgressData
    }
    async getAllowedCourses(user){
        const Progress = await courseProgressModel.find({ user }).populate([
            {
                path: 'lastLesson',
                populate: 'lesson module'
            }, 
            {
                path: "course"
            }
        ]).lean()
        return Progress.map(progress => new UserCourseDto(progress))
    }


}
module.exports = new CourseProgressService()