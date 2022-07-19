class CourseProgressDto {
    constructor(model){
        //this.user = model.user
        //this.course = model.course
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
            this.lastLesson = model.lastLesson._id
        }
    }
}
module.exports = CourseProgressDto