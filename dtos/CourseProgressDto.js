class CourseProgressDto {
    constructor(model){
        this.id = model._id
        this.format = model.format
        this.isAvailable = model.isAvailable
        this.isCompleted = model.isCompleted
        if(model.completedLessonsCount){
            this.completedLessonsCount = model.completedLessonsCount
        }
        if(model.totalLessonsCount){
            this.totalLessonsCount = model.totalLessonsCount
        }
        if(model.lastLesson?.module?.title && model.lastLesson?.lesson?.title){
            this.lastLesson = model.lastLesson.module.title + ', ' + model.lastLesson.lesson.title;
        }
        if(model.user.name && model.user.surname){
            this.fullname = model.user.name + ' ' + model.user.surname
        }
        if(model.createdAt){
            this.startedAt = model.createdAt;
        }
        if(model.updatedAt){
            this.updatedAt = model.updatedAt;
        }
    }
}
module.exports = CourseProgressDto
