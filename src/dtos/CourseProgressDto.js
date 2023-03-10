class CourseProgressDto {
    constructor(model){
        this.id = model._id
        this.course = model.course
        this.user = model.user
        this.format = model.format
        this.isAvailable = model.isAvailable
        this.isCompleted = model.isCompleted
        if(model.completedLessonsCount && model.totalLessonsCount){
            this.percent = Math.ceil(model.completedLessonsCount * 100 / model.totalLessonsCount)
        }
        if(model.lastLesson){
            this.lastLesson = ToLastLesson(model.lastLesson)
        }
        if(model.user?.name){
            this.user = {
                id: model.user._id,
                name: model.user.name,
                surname: model.user.surname
            }
        }
        if(model.createdAt){
            this.startedAt = model.createdAt;
        }
        if(model.endAt){
            this.endAt = model.endAt;
        }
        if(model.updatedAt){
            this.updatedAt = model.updatedAt;
        }
    }
}

function ToLastLesson(model){
    if(model.lesson && model.lesson.title && model.module && model.module.title){
        return model.module.title + ' ' + model.lesson.title
    } else {
        return null
    }
}

module.exports = CourseProgressDto
