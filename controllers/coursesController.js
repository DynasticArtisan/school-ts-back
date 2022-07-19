const roles = require("../utils/roles")
const ApiError = require("../exceptions/ApiError");

const coursesService = require("../services/coursesService");
const exerciseService = require("../services/exerciseService");
const courseProgressService = require("../services/courseProgressService");
const modulesService = require("../services/modulesService");
const lessonsService = require("../services/lessonsService");

class CoursesController {
    async createCourse(req, res, next){
        try {
            const { icon, image } = req.files;
            const { title, subtitle, description } = req.body;
            const { role } = req.user;
            if(role === roles.super){
                if(!icon || !image){
                    throw ApiError.BadRequest("Изображения не найдены")
                }
                const Course = await coursesService.createCourse({ title, subtitle, description, image: 'images/'+ image[0].filename, icon: 'images/'+ image[0].filename })
                res.json(Course)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async createCourseProgress(req, res, next){
        try {
            const { id: course } = req.params;
            const { role } = req.user;
            const { user, format } = req.body;
            if(role === roles.super){
                await coursesService.getCourse(course)
                const Progress = await courseProgressService.createProgress({ user, course, format })
                res.json(Progress)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }

    async getProgressCourses(req, res, next){
        try {
            const { role, id } = req.user;
            if(role === roles.user){
                //const coursesData = await courseProgressService.getSingleUserProgresses(id)
                const coursesData = await coursesService.getUserCourses(id)
                res.json(coursesData)
            }
            else if( role === roles.super){
                const coursesData = await coursesService.getProgressCourses()
                res.json(coursesData)
            } 
            else {
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
                const coursesData = await coursesService.getHomeworkCourses()
                res.json(coursesData)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }


    async getCourseModules(req, res, next){
        try {
            const { id: course } = req.params;
            const { role, id:user } = req.user;
            if(role === roles.user){
                const Progress = await courseProgressService.getProgress({ user, course })
                const Course = await coursesService.getCourseModulesProgress(course, user)
                res.json({ ...Course, progress: Progress })
            } else if(role === roles.super) {
                const courseData = await coursesService.getCourseModules(course);
                res.json(courseData)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async getCourseStudents(req, res, next){
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
    async getCourseExercises(req, res, next){
        try {
            const { role, id:user } = req.user;
            const { id } = req.params;
            if(role === roles.super){
                const Course = await coursesService.getCourse(id)
                const Exercises = await exerciseService.getCourseExercises(id)
                res.json({ ...Course, exercises: Exercises })
            } else {
                next(ApiError.UnauthorizedError)
            }
        } catch (e) {
            next(e)
        }
    }

    async updateCourse(req, res, next){
        try {
            const { id } = req.params;
            const { role } = req.user;
            const { icon, image } = req.files;
            const { title, subtitle, description } = req.body;
            if(role === roles.super){
                const course = { title, subtitle, description }
                if(icon){
                    course.icon = "images/" + icon[0].filename
                }
                if(image){
                    course.image = "images/" + image[0].filename
                }
                const Course = await coursesService.updateCourse(id, course)
                res.json(Course)
            } else {
                next(ApiError.Forbidden())
            }
        } catch(e){
            next(e)
        }
    }
    async updateCourseAccess(req, res, next){
        try {
            const { id: course } = req.params;
            const { role } = req.user;
            const { user } = req.body;
            const { isAvailable } = req.body
            if(role === roles.super){
                const Progress = await courseProgressService.updateProgress({ user, course}, { isAvailable })
                res.json(Progress)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }



    async deleteCourse(req,res,next){
        try {
            const { id } = req.params;
            const { role } = req.user;
            if(role === roles.super){
                await coursesService.deleteCourse(id)
                await modulesService.deleteCourseModules(id)
                await lessonsService.deleteCourseLessons(id)
                res.json({ message: "Курс удален" })
            } else {
                next(ApiError.Forbidden())
            }
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
}

module.exports = new CoursesController()