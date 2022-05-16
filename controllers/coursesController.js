const coursesService = require("../services/coursesService");

class CoursesController {
    async getAllCoursesData(req, res, next){
        try {
            const coursesData = await coursesService.getAllCoursesData()
            res.json(coursesData);
        } catch (e) {
            next(e)
        }
    }

    // COURSE CONTROLLER

    async createCourse(req, res, next){
        try {
            const { urlname, title, subtitle, description, image } = req.body;
            const data = await coursesService.createCourse( urlname, title, subtitle, description, image )
            res.json(data)
        } catch (e) {
            next(e)
        }
    }
    async getCourse(req, res, next){
        try {
            const { courseId } = req.params;
            const data = await coursesService.getCourse(courseId)
            res.json(data)
        } catch (e) {
            next(e)
        }
    }
    async getCourses(req, res, next){
        try {
            const data = await coursesService.getAllCourses()
            res.json(data)
        } catch (e) {
            next(e)
        }
    }
    async updateCourse(req,res,next){
        try {
            const { courseId } = req.params;
            const data = await coursesService.updateCourse(courseId, req.body)
            res.json(data)
        } catch(e){
            next(e)
        }
    }
    async deleteCourse(req,res,next){
        try {
            const { courseId } = req.params;
            await coursesService.deleteCourse(courseId)
            res.json({ message: "Запись о курсе удалена" })
        } catch(e){
            next(e)
        }
    }
    async dropAllCourses(req,res,next){
        try {
            const data = await coursesService.dropAllCourses()
            res.json(data)
        } catch (e) {
            next(e)
        }
    }

    // MODULE CONTROLLER

    async createModule(req, res, next){
        try {
            // const { urlname, title, description, courseId } = req.body;
            const moduleData = await coursesService.createModule(req.body)
            res.json(moduleData)
        } catch (e) {
            next(e)
        }
    }
    async getModules(req, res, next){
        try {
            const data = await coursesService.getModules()
            res.json(data)
        } catch (e) {
            next(e)
        }
    }
    async getOneModule(req, res, next){
        try {
            const { moduleId } = req.params;
            const data = await coursesService.getOneModule(moduleId)
            res.json(data)
        } catch (e) {
            next(e)
        }
    }
    async updateModule(req, res, next){
        try {
            const { moduleId } = req.params;
            const data = await coursesService.updateModule(moduleId, req.body)
            res.json(data)
        } catch (e) {
            next(e)
        }
    }
    async deleteModule(req, res, next){
        try {
            const { moduleId } = req.params;
            await coursesService.deleteModule(moduleId)
            res.json({message:"Запись о модуле удалена"})
        } catch (e) {
            next(e)
        }
    }
    async dropAllModules(req,res,next){
        try {
            const data = await coursesService.dropAllModules()
            res.json(data)
        } catch (e) {
            next(e)
        }
    }

    // LESSON CONTROLLER

    async createLesson(req, res, next){
        try {
            const lessonData = await coursesService.createLesson(req.body)
            res.json(lessonData)
        } catch (e) {
            next(e)
        }
    }
    async getAllLesson(req, res, next){
        try {
            const data = await coursesService.getLessons()
            res.json(data)
        } catch (e) {
            next(e)
        }
    }
    async getOneLesson(req, res, next){
        try {
            const { lessonId } = req.params;
            const { user } = req.query;
            const data = await coursesService.getOneLesson(lessonId, user)
            res.json(data)
        } catch (e) {
            next(e)
        }
    }
    async updateLesson(req, res, next){
        try {
            const { lessonId } = req.params;
            const data = await coursesService.updateLesson(lessonId, req.body)
            res.json(data)
        } catch (e) {
            next(e)
        }
    }
    async deleteLesson(req, res, next){
        try {
            const { lessonId } = req.params;
            await coursesService.deleteLesson(lessonId)
            res.json({message:"Запись об уроке удалена"})
        } catch (e) {
            next(e)
        }
    }
    async dropAllLessons(req,res,next){
        try {
            const data = await coursesService.dropAllLessons()
            res.json(data)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new CoursesController()