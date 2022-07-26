const HomeworkDto = require("./HomeworkDto");
const LessonProgressDto = require("./LessonProgressDto");

class LessonDto {
    constructor(model){
      this.id = model._id;
      if(model.module.title){
        this.module = model.module.title
      } else if(model.module){
        this.module = model.module
      }
      if(model.course){
        this.course = model.course
      }    
      if(model.title){
        this.title = model.title
      }    
      if(model.description){
        this.description = model.description
      }
      if(model.content){
        this.content = model.content
      }
      if(model.prevLesson){
        this.prev = model.prevLesson
      }
      if(model.nextLesson){
        this.next = model.nextLesson._id
      }
      if(model.withExercise){
        this.withExercise = model.withExercise
      }
      if(model.exercise){
        this.exercise = model.exercise
      }
      if(model.homework){
        this.homework = new HomeworkDto(model.homework)
      }
      if(model.progress){
        this.progress = new LessonProgressDto(model.progress)
      }
      // if(model.firstLesson){
      //   this.firstLesson = model.firstLesson
      // }
    }
  }
  module.exports = LessonDto