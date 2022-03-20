const courseModel = require("../models/courseModel")
const moduleModel = require("../models/moduleModel")
const lessonModel = require("../models/lessonModel")
const ApiError = require("../exceptions/ApiError")

class CoursesService {
    async getUserCoursesData(userId){
      return {}  
    }

    async getAllCoursesData(){
        const courses = await courseModel.find().populate({
          path: 'modules',
          model: moduleModel,
          populate: {
            path: 'lessons',
            model: lessonModel
          }
        })
        return { courses }
    }

    async createCourse( urlname, title, subtitle, description, image ){
      
      const Course = await courseModel.create({ urlname, title, subtitle, description, image })
      return Course
    }

    async createModule({ urlname, title, description, courseId }){
      const Course = await courseModel.findById(courseId)
      if(!Course){
        throw ApiError.BadRequest('Курс не найден')
      }
      const Module = await moduleModel.create({ urlname, title, description })
      Course.modules.push(Module._id)
      await Course.save()
      return Module
    }

    async createLesson({ urlname, title, description, moduleId }){
      const Module = await moduleModel.findById(moduleId)
      if(!Module){
        throw ApiError.BadRequest('Модуль не найден')
      }
      const Lesson = await lessonModel.create({ urlname, title, description })
      Module.lessons.push(Lesson._id)
      await Module.save()
      return Lesson
    }

}

module.exports = new CoursesService()