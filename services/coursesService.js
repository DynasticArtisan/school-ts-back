const CourseDto = require("../dtos/CourseDto")
const courseModel = require("../models/courseModel")

const ApiError = require("../exceptions/ApiError")
const { AdminCoursesProgressDto, AdminSingleCourseDto } = require("../dtos/progressDtos")

class CoursesService {
    async createCourse( course ){
      const Course = await courseModel.create(course)
      return new CourseDto(Course)
    }

    async getUserCourses(user){
      const Courses = await courseModel.find().populate({
        path: "progress",
        populate: [
          {
            path: "completedLessonsCount",
            match: { user }
          },
          {
            path: "totalLessonsCount"
          }
        ]
      })
      return Courses.map(course => new CourseDto(course))
    }
    async getProgressCourses(){
      const Courses = await courseModel.find().populate("totalCompleted").populate("totalInProgress").lean()
      return Courses.map(course => new CourseDto(course))
    }
    async getHomeworkCourses(){
      const Courses = await courseModel.find()
      return Courses.map(course => new CourseDto(course))
    }

    async getCourse(id){
      const Course = await courseModel.findById(id)
      if(!Course){
        throw ApiError.BadRequest("Курс не найден")
      }
      return new CourseDto(Course)
    }
    async getCourseModules(id){
      const Course = await courseModel.findById(id).populate('modules').lean()
      if(!Course){
        throw ApiError.BadRequest("Курс не найден")
      }
      return new CourseDto(Course)
    }
    async getCourseModulesProgress(id, user){
      const Course = await courseModel.findById(id).populate({
        path: 'modules',
        populate: {
          path: 'progress',
          math: { user }
        }
      })
      if(!Course){
        throw new ApiError.BadRequest("Курс не найден")
      }
      return new CourseDto(Course)
    }

    async updateCourse(id, course){
      const Course = await courseModel.findByIdAndUpdate(id, course, {new: true})
      if(!Course){
        throw ApiError.BadRequest("Курс не найден")
      }
      return new CourseDto(Course)
    }
    async deleteCourse(id){
      const Course = await courseModel.findByIdAndDelete(id)
      if(!Course){
        throw ApiError.BadRequest("Курс не найден")
      }
      return Course
    }

    async dropAllCourses(){
      await courseModel.deleteMany()
    }
}

module.exports = new CoursesService()