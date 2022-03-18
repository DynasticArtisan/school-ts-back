const courseModel = require("../models/courseModel")
const moduleModel = require("../models/moduleModel")
const lessonModel = require("../models/lessonModel")

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
}

module.exports = new CoursesService()