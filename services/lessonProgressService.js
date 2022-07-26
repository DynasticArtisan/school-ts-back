const ApiError = require("../exceptions/ApiError");
const LessonProgressDto2 = require("../dtos/LessonProgressDto");

const lessonProgressModel = require("../models/ULProgressModel");
const moduleProgressService = require("./moduleProgressService");

class LessonProgressService {
    async createProgress({ user, lesson, module, course }) {
        const PrevProgress = await lessonProgressModel.findOne({ user, lesson })
        if(PrevProgress){
            throw ApiError.BadRequest("Урок уже доступен пользователю")
        }
        const Progress = await lessonProgressModel.create({ user, lesson, module, course });
        return new LessonProgressDto2(Progress)
    }
    async updateProgress(progress, payload){
        const Progress = await lessonProgressModel.findOneAndUpdate(progress, payload, { new: true })
        if(!Progress){
            throw ApiError.BadRequest('Прогресс пользователя не найден')
        }
        return new LessonProgressDto2(Progress)
    }

    async getProgress(lesson, user){
        const Progress = await lessonProgressModel.findOne({ user, lesson })
        if(!Progress){
            throw ApiError.BadRequest("Прогресс пользователя не найден")
        }
        return new LessonProgressDto2(Progress)
    }

    async completeProgress({ user, lesson }){
        const Progress = await lessonProgressModel.findOneAndUpdate({ user, lesson }, { isCompleted: true }, { new: true }).populate({
            path: 'lesson',
            populate: 'nextLesson'
        }).lean();
        if(!Progress){
            throw ApiError.BadRequest('Прогресс пользователя не найден')
        }
        try {
            if(Progress.lesson.nextLesson){
                await this.createProgress({ user, lesson: Progress.lesson.nextLesson, module: Progress.lesson.module, course: Progress.lesson.course })
            } else {
                await moduleProgressService.completeProgress({ user, module: Progress.lesson.module })
            }
        } catch (error) {
            
        } finally {
            return new LessonProgressDto2(Progress)
        }
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