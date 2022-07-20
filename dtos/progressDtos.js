const exerciseModel = require("../models/exerciseModel")

class SingleCourseProgressDto {
    constructor(model){
        this.id = model._id
        this.user = model.user
        this.format = model.format
        this.startedAt = model.createdAt
        this.isCompleted = model.isCompleted
        this.completedAt = model.completedAt
        this.currentLesson = model.lastLesson.lesson.title
        this.currentModule = model.lastLesson.module.title
    }
}

class UserCoursesProgressDto {
    constructor(model){
        this.id = model.course._id
        this.url = model.course.urlname
        this.title = model.course.title
        this.subtitle = model.course.subtitle
        this.isCompleted = model.isCompleted
        this.progressPercent = Math.round(model.totalCompleted * 100 / model.course.totalLessons)
    }
}
class AdminCoursesProgressDto{
    constructor(model){
        this.id = model._id
        this.url = model.urlname
        this.title = model.title
        this.subtitle = model.subtitle
        this.description = model.description
        this.totalInProgress = model.totalInProgress
        this.totalCompleted = model.totalCompleted
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
class AdminSingleCourseDto {
    constructor(model){
        this.id = model._id
        this.url = model.urlname
        this.title = model.title
        this.subtitle = model.subtitle
        this.description = model.description
        this.image = model.image
        this.modules = model.modules.map(module => ({
            id: module._id,
            title: module.title,
            description: module.description,
            first: Boolean(module.firstModule),
            prev: module.prevModule,
            isAvailable: true,
            fullAccess: true
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

class AdminSingleModuleDto {
    constructor(model){
        this.courseId = model.course
        this.id = model._id
        this.title = model.title
        this.description = model.description
        this.lessons = model.lessons.map(lesson => ({
            id: lesson._id,
            title: lesson.title,
            description: lesson.description,
            content: lesson.content,
            first: Boolean(lesson.firstModule),
            prev: lesson.prevModule,
            fullAccess: true,
            isAvailable: true,
            homework: lesson.exercise.task
        }))
    }
}


class UserCourseDto {
    constructor(model){
        this.id = model._id
        this.course = model.course._id
        this.isAvailable = model.isAvailable
        this.isCompleted = model.isCompleted
        this.format = model.format
        this.title = model.course.title
        this.subtitle = model.course.subtitle
        this.image = model.course.image
        this.mobileImage = model.course.mobileImage
        if(model.lastLesson){
            this.lastLesson = model.lastLesson.module.title + ' ' + model.lastLesson.lesson.title
        } else {
            this.lastLesson = "Курс не начат"
        }

    }
}



module.exports = {
    SingleCourseProgressDto, UserCoursesProgressDto, UserSingleCourseProgressDto, UserSingleModuleProgressDto,  AdminCoursesProgressDto, AdminSingleCourseDto,
    AdminSingleModuleDto, UserCourseDto
}