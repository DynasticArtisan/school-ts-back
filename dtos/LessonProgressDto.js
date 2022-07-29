const HomeworkDto = require("./HomeworkDto")

class LessonProgressDto {
    constructor(model){
        this.id = model._id
        this.user = model.user
        this.lesson = model.lesson
        this.module = model.module
        this.course = model.course
        this.isAvailable = model.isAvailable
        this.isCompleted = model.isCompleted
        if(model.homework){
            this.homework = new HomeworkDto(model.homework)
        }
    }
}
module.exports = LessonProgressDto