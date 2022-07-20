const ApiError = require("../exceptions/ApiError")
const LessonDto = require("../dtos/LessonDto")
const lessonModel = require("../models/lessonModel")

class LessonsService {
    async createLesson( lesson ){
        if(lesson.prevLesson){
          const PrevLesson = await lessonModel.findById(lesson.prevLesson)
          if(!PrevLesson){
            throw ApiError.BadRequest('Предыдущий урок не найден')
          }
        } 
        else {
          const ModuleLessons = await lessonModel.find({ module: lesson.module }).populate("nextLesson").lean()
          const PrevLesson = ModuleLessons.find((lesson) => !lesson?.nextLesson );
          if(PrevLesson){
            lesson.prevLesson = PrevLesson._id
          } else {
            lesson.firstLesson = true
          }
        }
        const Lesson = await lessonModel.create(lesson)
        return new LessonDto(Lesson)
    }
    async updateLesson(id, lesson){
      const Lesson = await lessonModel.findByIdAndUpdate(id, lesson, {new: true});
      if(!Lesson){
        throw ApiError.BadRequest('Урок не найден')
      }
      return new LessonDto(Lesson)
    }
    async getLesson(id){
      const Lesson = await lessonModel.findById(id).populate('nextLesson').lean();
      if(!Lesson){
        throw ApiError.BadRequest('Урок не найден')
      }
      return new LessonDto(Lesson)
    }
    async getLessonProgress(id, user){
      const Lesson = await lessonModel.findById(id).populate('nextLesson').populate([
        {
          path: 'progress',
          match: { user }
        },
        {
          path: 'homework',
          match: { user }
        }
      ]).lean();
      if(!Lesson){
        throw ApiError.BadRequest('Урок не найден')
      }
      return new LessonDto(Lesson)
    }
    async getCourseExercises(course){
        const Lessons = await lessonModel.find({ course, withExercise: true })
        return Lessons.map(lesson => new LessonDto(lesson))
    }
    async getFirstLesson(module){
      const Lesson = await lessonModel.findOne({ module, firstLesson: true })
      if(!Lesson){
        throw ApiError.BadRequest("Урок не найден")
      }
      return new LessonDto(Lesson)
    }
    async deleteLesson(id){
      const Lesson = await lessonModel.findById(id)
      if(!Lesson){
        throw ApiError.BadRequest('Урок не найден')
      }
      await lessonModel.findOneAndUpdate({ prevLesson: Lesson._id }, { prevLesson: Lesson.prevLesson, firstLesson: Lesson.firstLesson })
      await lessonModel.findByIdAndDelete(Lesson._id)
    }
    async deleteModuleLessons(module){
      await lessonModel.deleteMany({ module })
    }
    async deleteCourseLessons(course){
      await lessonModel.deleteMany({ course })
    }

    async dropAllLessons(){
      const Lessons = await lessonModel.deleteMany()
      return Lessons
    }
}

module.exports = new LessonsService()