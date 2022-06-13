const { AdminCoursesProgressDto, UserCoursesProgressDto, CourseStudentDto, UserSingleCourseProgressDto } = require("../dtos/progressDtos");
const ApiError = require("../exceptions/ApiError");
const courseModel = require("../models/courseModel");
const courseProgressModel = require("../models/UCProgressModel");

class CourseProgressService {
    async createProgress(payload) {
        const Progress = await courseProgressModel.create(payload);
        return Progress
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
    async updateProgress(progressID, payload){
        const Progress = await courseProgressModel.findByIdAndUpdate(progressID, payload, { new: true })
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
    async getCourseProgresses(course){
        const Course = await courseModel.findById(course).select('-_id title')
        if(!Course){
            throw ApiError.BadRequest("NOT SUCH COURSE")
        }
        const Students = await courseProgressModel.find({ course }).populate([
            {
                path: 'user',
                select: ' name surname'
            },
            {
                path: 'lastLesson',
                populate: 'lesson module'
            }
        ]).lean()
        const StudentsData = Students.map(progress => new CourseStudentDto(progress))
        return { course: Course.title, students: StudentsData }
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
    async setCourseAccess(id, isAvailable){
        const Progress = await courseProgressModel.findByIdAndUpdate(id, { isAvailable }, { new: true })
        if(!Progress){
            throw ApiError.BadRequest("Прогресс пользователя не найден")
        }
        return Progress

    }

}
module.exports = new CourseProgressService()