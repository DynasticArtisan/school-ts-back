const LessonDto = require("./LessonDto");
const ModuleProgressDto = require("./ModuleProgressDto");

class ModuleDto {
    constructor(model){
      this.id = model._id;
      if(model.course){
        this.course = model.course
      }    
      if(model.title){
        this.title = model.title
      }    
      if(model.description){
        this.description = model.description
      }
      if(model.lessons){
        this.lessons = model.lessons.map(lesson => new LessonDto(lesson))
      }
      if(model.progress){
        this.progress = new ModuleProgressDto(model.progress)
      }
      this.first = model.firstModule
    }
  }

  module.exports = ModuleDto