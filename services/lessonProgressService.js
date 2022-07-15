const ApiError = require("../exceptions/ApiError");
const lessonProgressModel = require("../models/ULProgressModel");

class LessonProgressService {
    async createProgress(payload) {
        const Progress = await lessonProgressModel.create(payload);
        return Progress
    }
    async getAllProgresses(){
        const Progresses = await lessonProgressModel.find()
        return Progresses
    }
    async getOneProgress(progressID){
        const Progress = await lessonProgressModel.findById(progressID)
        if(!UCProgress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return Progress
    }
    async updateProgress(progressID, payload){
        const Progress = await lessonProgressModel.findByIdAndUpdate(progressID, payload, { new: true })
        if(!UCProgress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return Progress
    }
    async deleteProgress(progressID){
        const Progress = await lessonProgressModel.findByIdAndDelete(progressID)
        if(!Progress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return Progress
    }
    async deleteAllProgresses(){
        const Progresses = await lessonProgressModel.deleteMany()
        return Progresses
    }
    async getUserLessonProgress( lesson, user ){
        const Lesson = await lessonProgressModel.findOne({ lesson, user, isAvailable: true }).select('isCompleted -_id')
        if(!Lesson){
            throw ApiError.Forbidden()
        }
        return Lesson
    }

    async completeLesson(lesson, user){
        const Progress = await lessonProgressModel.findOneAndUpdate({ lesson, user },{ isCompleted: true }, {new: true})
        if(!Progress){
            throw ApiError.BadRequest("Прогресс не найден")
        }
        return LessonProgressDto(Progress)
    }
}




class LessonProgressDto {
    constructor(model){
      this.id = model.lesson._id;
      this.title = model.lesson.title;
      this.description = model.lesson.description
      this.content = model.lesson.content
      this.module = model.lesson.module
      if(model.lesson.prevLesson){
        this.prev = model.lesson.prevLesson
      }
      if(model.lesson.nextLesson){
        this.next = model.lesson.nextLesson._id
      }
      this.isCompleted = model.isCompleted
    }
  }



module.exports = new LessonProgressService()