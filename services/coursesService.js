const courseModel = require("../models/courseModel")
const moduleModel = require("../models/moduleModel")
const lessonModel = require("../models/lessonModel")
const userProgressModel = require("../models/userProgressModel")
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
        return courses
    }

    async createCourse( urlname, title, subtitle, description, image ){
      
      const Course = await courseModel.create({ urlname, title, subtitle, description, image })
      return Course
    }

    async createModule( urlname, title, description, courseId ){
      const Course = await courseModel.findById(courseId)
      if(!Course){
        throw ApiError.BadRequest('Курс не найден')
      }
      const Module = await moduleModel.create({ urlname, title, description })
      Course.modules.push(Module._id)
      await Course.save()
      return Module
    }

    async createLesson( urlname, title, description, moduleId ){
      const Module = await moduleModel.findById(moduleId)
      if(!Module){
        throw ApiError.BadRequest('Модуль не найден')
      }
      const Lesson = await lessonModel.create({ urlname, title, description })
      Module.lessons.push(Lesson._id)
      await Module.save()
      return Lesson
    }

    
    async getUserProgress( userId ){   
      const UserProgress = await userProgressModel.findOne({ user: userId });
      if(!UserProgress){
        throw ApiError.BadRequest('Прогресс пользователя не найден')
      }
      return UserProgress
    }

    async copleteLesson( lessonId, userId ){
      console.log(userId)
      let UserProgress = await userProgressModel.findOne({user: userId});
      if(!UserProgress){
        UserProgress = await userProgressModel.create({ user: userId, lessons: [] });
      }
      const lesson = UserProgress.lessons?.find(lesson => lesson.lesson === lessonId)
      if(lesson) {
        lesson.isCompleted = true
      } else {
        UserProgress.lessons.push({ lesson: lessonId, isCompleted: true })
      }
      await UserProgress.save()
      return UserProgress
    }


}

module.exports = new CoursesService()