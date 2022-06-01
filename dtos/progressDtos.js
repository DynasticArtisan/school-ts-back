class SingleCourseProgressDto {
    constructor(model){
        this.id = model._id
        this.user = model.user
        this.format = model.format
        this.startedAt = model.createdAt
        this.isCompleted = model.isCompleted
        this.completedAt = model.completedAt
        this.currentLesson = model.lastLesson.lesson.title
        this.currentModel = model.lastLesson.module.title
    }
}

class UserCoursesProgressDto {
    constructor(model){
        this.id = model.course._id
        this.url = model.course.urlname
        this.title = model.course.title
        this.description = model.course.subtitle
        this.isCompleted = model.isCompleted
        this.progressPercent = Math.round(model.totalCompleted * 100 / model.course.totalLessons)
    }


}




module.exports = {
    SingleCourseProgressDto, UserCoursesProgressDto
}