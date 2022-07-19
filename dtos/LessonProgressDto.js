class LessonProgressDto {
    constructor(model){
        this.id = model._id
        this.user = model.user
        this.lesson = model.lesson
        this.module = model.module
        this.course = model.course
        this.isAvailable = model.isAvailable
        this.isCompleted = model.isCompleted
    }
}
module.exports = LessonProgressDto