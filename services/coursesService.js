const courseModel = require("../models/courseModel")
const moduleModel = require("../models/moduleModel")
const lessonModel = require("../models/lessonModel")

const ApiError = require("../exceptions/ApiError")
const { AdminCoursesProgressDto } = require("../dtos/progressDtos")

class CoursesService {
    // superadmin -> courses page
    async getAllCoursesData(){
      const AllCourses = await courseModel.find().select('title subtitle')
      const AllCoursesData = AllCourses.map(item => new AdminCoursesProgressDto(item))
      return AllCoursesData
    }
    // superadmin -> homework courses page
    async getAllCoursesDataWithStatistics(){
      const AllCourses = await courseModel.find().select('title subtitle').populate("totalCompleted").populate("totalInProgress").lean()
      return AllCourses.map(item => new AdminCoursesProgressDto(item))
    }

    async getCoursesList(){
      const Courses = await courseModel.find().select('title')
      return Courses.map(c => ({id: c._id, title: c.title}))
    }
    async getWholeCoursesProgress(){
      const CoursesData = await courseModel.find().select('title subtitle').populate("totalCompleted").populate("totalInProgress").lean()
      return CoursesData
    }



    // COURSE SERVICE
    async createCourse( payload ){
      const Course = await courseModel.create(payload)
      return Course
    }
    async getAllCourses(){
      const Courses = await courseModel.find().lean().populate('totalLessons')
      return Courses
    }
    async getCourse(courseId){
      const Course = await courseModel.findById(courseId)
      return Course
    }
    async updateCourse(courseId, data){
      const Course = await courseModel.findByIdAndUpdate(courseId, data, {new: true})
      return Course
    }
    async deleteCourse(courseId){
      const Course = await courseModel.findByIdAndRemove(courseId)
      return Course
    }
    async dropAllCourses(){
      const Courses = await courseModel.deleteMany()
      return Courses
    }


  // MODULE SERVICE

    async createModule(payload){
      const Course = await courseModel.findById(payload.course)
      if(!Course){
        throw ApiError.BadRequest('Курс не найден')
      }
      if(payload.prevModule){
        const PrevModule = await moduleModel.findById(payload.prevModule)
        if(!PrevModule){
          throw ApiError.BadRequest('Предыдущий модуль не найден')
        }
      }
      const Module = await moduleModel.create(payload)
      return Module
    }
    async getModules(){
      const Modules = await moduleModel.find();
      return Modules
    }
    async getOneModule(moduleId){
      const Module = await moduleModel.findById(moduleId).lean();
      if(!Module){
        throw ApiError.BadRequest('Модуль не найден')
      }
      return Module
    }
    async updateModule(moduleId, data){
      const Module = await moduleModel.findByIdAndUpdate(moduleId, data, {new: true})
      if(!Module){
        throw ApiError.BadRequest('Модуль не найден')
      }
      return Module
    }
    async deleteModule(moduleId){
      const Module = await moduleModel.findByIdAndDelete(moduleId);
      if(!Module){
        throw ApiError.BadRequest('Модуль не найден')
      }
      return Module
    }
    async dropAllModules(){
      const Modules = await moduleModel.deleteMany()
      return Modules
    }

  // LESSON SERVICE

    async createLesson( payload ){
      const Module = await moduleModel.findById(payload.module)
      if(!Module){
        throw ApiError.BadRequest('Модуль не найден')
      }
      if(payload.prevLesson){
        const PrevLesson = await lessonModel.findById(payload.prevLesson)
        if(!PrevLesson){
          throw ApiError.BadRequest('Предыдущий урок не найден')
        }
      }
      const Lesson = await lessonModel.create(payload)
      return Lesson
    }
    async getLessons(){
      const Lessons = await lessonModel.find();
      return Lessons
    }
    async getOneLesson(lessonId){
      const Lesson = await lessonModel.findById(lessonId);
      if(!Lesson){
        throw ApiError.BadRequest('Урок не найден')
      }
      return Lesson
    }
    // async getOneLesson(lessonId, userID){
    //   const Lesson = await lessonModel.findById(lessonId).lean().populate({
    //     path: 'progress',
    //     model: ULProgressModel,
    //     match: { user: userID }
    //   });
    //   if(!Lesson){
    //     throw ApiError.BadRequest('Урок не найден')
    //   }
    //   return Lesson
    // }
    async updateLesson(lessonId, data){
      const Lesson = await lessonModel.findByIdAndUpdate(lessonId, data, {new: true});
      if(!Lesson){
        throw ApiError.BadRequest('Урок не найден')
      }
      return Lesson
    }
    async deleteLesson(lessonId){
      const Lesson = await lessonModel.findByIdAndDelete(lessonId);
      if(!Lesson){
        throw ApiError.BadRequest('Урок не найден')
      }
      return Lesson
    }
    async dropAllLessons(){
      const Lessons = await lessonModel.deleteMany()
      return Lessons
    }

}

module.exports = new CoursesService()