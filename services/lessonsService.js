const lessonModel = require("../models/lessonModel")
const moduleModel = require("../models/moduleModel")

class LessonsService {
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
    async getAllLessons(){
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
    async updateLesson(lessonId, payload){
      const Lesson = await lessonModel.findByIdAndUpdate(lessonId, payload, {new: true});
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

    async getOneLessonData(lesson){
      const Lesson = await lessonModel.findById(lesson).populate('nextLesson exercise').lean();
      if(!Lesson){
        throw ApiError.BadRequest('Урок не найден')
      }
      return new LessonDto(Lesson)
    }

}


class LessonDto {
  constructor(model){
    this.id = model._id;
    this.title = model.title;
    this.description = model.description
    this.module = model.module
    if(model.prevLesson){
      this.prev = model.prevLesson
    }
    if(model.nextLesson){
      this.next = model.nextLesson._id
    }
    if(model.exercise){
      this.exercise = model.exercise
    }
  }
}



module.exports = new LessonsService()