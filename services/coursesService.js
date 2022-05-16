const courseModel = require("../models/courseModel")
const moduleModel = require("../models/moduleModel")
const lessonModel = require("../models/lessonModel")
const userProgressModel = require("../models/userProgressModel")
const ULProgressModel = require("../models/ULProgressModel")
const ApiError = require("../exceptions/ApiError")

class CoursesService {
    async getAllCoursesData(){
        const Courses = await courseModel.find().populate({
          path: 'modules',
          model: moduleModel,
          populate: {
            path: 'lessons',
            model: lessonModel
          }
        })
        return Courses
    }

    // COURSE SERVICE

    async createCourse( payload ){
      const Course = await courseModel.create(payload)
      return Course
    }
    async getAllCourses(){
      const Courses = await courseModel.find()
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
      const PrevModule = await moduleModel.findById(payload.prevModule)
      if(!PrevModule && payload.prevModule){
        throw ApiError.BadRequest('Предыдущий модуль не найден')
      }
      const Module = await moduleModel.create(payload)
      Course.modules.push(Module._id)
      await Course.save()
      if(PrevModule){
        PrevModule.nextModule = Module._id
        await PrevModule.save()
      }
      return Module
    }
    async getModules(){
      const Modules = await moduleModel.find();
      return Modules
    }
    async getOneModule(moduleId){
      const Module = await moduleModel.findById(moduleId);
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
      const PrevLesson = await lessonModel.findById(payload.prevLesson)
      if(!PrevLesson && payload.prevLesson){
        throw ApiError.BadRequest('Предыдущий урок не найден')
      }
      const Lesson = await lessonModel.create(payload)
      Module.lessons.push(Lesson._id)
      await Module.save()
      if(PrevLesson){
        PrevLesson.nextLesson = Lesson._id
        await PrevLesson.save()
      }
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