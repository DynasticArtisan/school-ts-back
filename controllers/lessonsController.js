const ApiError = require("../exceptions/ApiError")
const exerciseService = require("../services/exerciseService")
const homeworkService = require("../services/homeworkService")
const lessonProgressService = require("../services/lessonProgressService")
const lessonsService = require("../services/lessonsService")
const roles = require("../utils/roles")

class LessonsController {
  async createLesson(req, res, next){
    try {
        const lessonData = await lessonsService.createLesson(req.body)
        res.json(lessonData)
    } catch (e) {
        next(e)
    }
  }
  async getAllLesson(req, res, next){
      try {
          const data = await lessonsService.getAllLessons()
          res.json(data)
      } catch (e) {
          next(e)
      }
  }
  async getOneLesson(req, res, next){
      try {
          const { id } = req.params;
          const data = await lessonsService.getOneLesson(id)
          res.json(data)
      } catch (e) {
          next(e)
      }
  }
  async updateLesson(req, res, next){
      try {
          const { id } = req.params;
          const data = await lessonsService.updateLesson(id, req.body)
          res.json(data)
      } catch (e) {
          next(e)
      }
  }
  async deleteLesson(req, res, next){
      try {
          const { id } = req.params;
          await lessonsService.deleteLesson(id)
          res.json({message:"Запись об уроке удалена"})
      } catch (e) {
          next(e)
      }
  }
  async dropAllLessons(req,res,next){
      try {
          const data = await lessonsService.dropAllLessons()
          res.json(data)
      } catch (e) {
          next(e)
      }
  }

  async getLessonContent(req, res, next){
      try {
          const {id} = req.params;
          const {role, id: user} = req.user;
          if(role === roles.user){
              const LessonProgress = await lessonProgressService.getUserLessonProgress(id, user)
              const Lesson = await lessonsService.getOneLessonData(id)
              if(Lesson.exercise){
                  const Homework = await homeworkService.getUserHomework(Lesson.exercise._id, user)
                  Lesson.exercise.homework = Homework
              }
              res.json({ ...Lesson, progress: LessonProgress, })
          }
          else if(role === roles.super){
              const Lesson = await lessonsService.getOneLessonData(id)
              res.json(Lesson)
          } else {
              next(ApiError.Forbidden())
          }
      } catch (e) {
          next(e)
      }
  }

}
module.exports = new LessonsController()