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
class UserSingleCourseProgressDto {
    constructor(model){
        this.id = model.course._id
        this.url = model.course.urlname
        this.title = model.course.title
        this.subtitle = model.course.subtitle
        this.description = model.course.description
        this.image = model.course.image
        this.modules = model.course.modules.map(module => ({
            id: module._id,
            title: module.title,
            description: module.description,
            first: Boolean(module.firstModule),
            prev: module.prevModule,
            isCompleted: module.progress ? module.progress.isCompleted : false,
            isAvailable: module.progress ? true : false
        }))

    }
}

class UserSingleModuleProgressDto {
    constructor(model){
        this.courseId = model.module.course
        this.id = model.module._id
        this.title = model.module.title
        this.description = model.module.description
        this.lessons = model.module.lessons.map(lesson => ({
            id: lesson._id,
            title: lesson.title,
            description: lesson.description,
            first: Boolean(lesson.firstModule),
            prev: lesson.prevModule,
            isCompleted: lesson.progress ? lesson.progress.isCompleted : false,
            isAvailable: lesson.progress ? true : false
        }))
    }
}


module.exports = {
    SingleCourseProgressDto, UserCoursesProgressDto, UserSingleCourseProgressDto, UserSingleModuleProgressDto
}