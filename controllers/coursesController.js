const roles = require("../utils/roles")
const ApiError = require("../exceptions/ApiError");
const coursesService = require("../services/coursesService");
const progressService = require("../services/progressService");
const exerciseService = require("../services/exerciseService");
const homeworkService = require("../services/homeworkService");
const coursesProgressService = require("../services/courseProgressService");

class CoursesController {
    async createCourse(req, res, next){
        try {
            const data = await coursesService.createCourse( req.body )
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
    async getCourse(req, res, next){
        try {
            const { id } = req.params;
            const data = await coursesService.getCourse(id)
            res.json(data)
        } catch (e) {
            next(e)
        }
    }
    async updateCourse(req,res,next){
        try {
            const { id } = req.params;
            const data = await coursesService.updateCourse(id, req.body)
            res.json(data)
        } catch(e){
            next(e)
        }
    }
    async deleteCourse(req,res,next){
        try {
            const { id } = req.params;
            await coursesService.deleteCourse(id)
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

    async getProgressCourses(req, res, next){
        try {
            const { role, id } = req.user;
            console.log(id)
            if(role === roles.user){
                const coursesData = await coursesProgressService.getSingleUserProgresses(id)
                res.json(coursesData)
            }
            else if( role === roles.super){
                const coursesData = await coursesService.getTotalProgresses()
                res.json(coursesData)
            } 
            else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async getCourseModules(req, res, next){
        try {
            const { id } = req.params;
            const { role, id:user } = req.user;
            if(role === roles.user){
                const courseData = await coursesProgressService.getCourseModulesProgress(user, id);
                res.json(courseData)
            } else if(role === roles.super) {
                const courseData = await coursesService.getSingleCourseData(id);
                res.json(courseData)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async getOneCourseStudents(req, res, next){
        try {
            const { id } = req.params;
            const { role, id:user } = req.user;
            if(role === roles.super){
                const Students = await coursesProgressService.getCourseProgresses(id)
                res.json(Students)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async getHomeworkCourses(req, res, next){
        try {
            const { role, id } = req.user;
            if(role === roles.super){
                const coursesData = await coursesService.getAllCoursesData()
                res.json(coursesData)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async getCourseExercises(req, res, next){
        try {
            const { role, id:user } = req.user;
            const { id } = req.params;
            if(role === roles.super){
                const Course = await coursesService.getOneCourseData(id)
                const Exercises = await exerciseService.getCourseExercises(id)
                res.json({ ...Course, exercises: Exercises })
            } else {
                next(ApiError.UnauthorizedError)
            }
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new CoursesController()