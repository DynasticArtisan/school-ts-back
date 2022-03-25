const coursesService = require("../services/coursesService");


class CoursesController {
    async getUserCoursesData(req, res, next){
        try {
            const { userId } = req.params;
            const courses = await coursesService.getAllCoursesData()
            const progress = await coursesService.getUserProgress( userId )
            res.json({courses, progress});
        } catch (e) {
            next(e)
        } 
    }
    async getAllCoursesData(req, res, next){
        try {
            const coursesData = await coursesService.getAllCoursesData()
            res.json(coursesData);
        } catch (e) {
            next(e)
        }
    }

    async createCourse(req, res, next){
        try {
            const { urlname, title, subtitle, description, image } = req.body;
            const courseData = await coursesService.createCourse( urlname, title, subtitle, description, image )
            res.json(courseData)
        } catch (e) {
            next(e)
        }
    }
    async createModule(req, res, next){
        try {
            const { urlname, title, description, courseId } = req.body;
            const moduleData = await coursesService.createModule({ urlname, title, description, courseId })
            res.json(moduleData)
        } catch (e) {
            next(e)
        }
    }
    async createLesson(req, res, next){
        try {
            const { urlname, title, description, moduleId } = req.body;
            const lessonData = await coursesService.createLesson({ urlname, title, description, moduleId })
            res.json(lessonData)
        } catch (e) {
            next(e)
        }
    }



    async getUserProgress(req, res, next){
        try {
            const { userId } = req.params;
            const progressData = await coursesService.getUserProgress( userId )
            res.json(progressData)
        } catch (e) {
            next(e)
        }
    }
    async copleteLesson(req, res, next){
        try {
            const { lessonId, userId } = req.body;
            console.log(userId)
            const progressData = await coursesService.copleteLesson( lessonId, userId )
            res.json(progressData)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new CoursesController()