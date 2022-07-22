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
        if(model.lastLesson){
            this.lastLesson = new LastLessonDto(model.lastLesson)
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

class LastLessonDto {
    constructor(model){
        this.id = model._id
        this.lesson = model.lesson?.title
        this.module = model.module?.title
    }
}
module.exports = CourseProgressDto
