const CourseProgressDto = require("./CourseProgressDto");
const ModuleDto = require("./ModuleDto");

class CourseDto {
    constructor(model){
        this.id = model._id
        if(model.title){
            this.title = model.title
        }
        if(model.subtitle){
            this.subtitle = model.subtitle
        }
        if(model.description){
            this.description = model.description
        }
        if(model.image){
            this.image = model.image
        }
        if(model.icon){
            this.icon = model.icon
        }
        if(model.totalLessons){
            this.totalLessons = model.totalLessons
        }
        if(model.totalInProgress){
            this.totalInProgress = model.totalInProgress
        }
        if(model.totalCompleted){
            this.totalCompleted = model.totalCompleted
        }
        if(model.modules){
            this.modules = model.modules.map(module => new ModuleDto(module))
        }
        if(model.progress){
            this.progress = new CourseProgressDto(model.progress)
        }
    }
}
module.exports = CourseDto