const roles = require("../utils/roles")
const ApiError = require("../exceptions/ApiError");

const coursesService = require("../services/coursesService");
const courseProgressService = require("../services/courseProgressService");
const courseMastersService = require("../services/courseMastersService");

const modulesService = require("../services/modulesService");
const lessonsService = require("../services/lessonsService");
const userService = require("../services/userService");

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
                await userService.getUser(user)
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
    async createCourseMaster(req, res, next){
        try {
            const { id: course } = req.params;
            const { role } = req.user;
            const { user } = req.body;
            if(role === roles.super){
                await userService.getUser(user)
                await coursesService.getCourse(course)
                const Master = await CourseMastersService.createMaster({ user, course })
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
            const { role, id: user } = req.user;
            if(role === roles.user){
                const Courses = await coursesService.getUserProgressCourses(user)
                res.json(Courses)
            } else if (role === roles.teacher || role === roles.curator){
                const Courses = await coursesService.getMasterProgressCourses(user)
                res.json(Courses)
            } else if ( role === roles.super){
                const Courses = await coursesService.getProgressCourses()
                res.json(Courses)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async getHomeworkCourses(req, res, next){
        try {
            const { role, id: user } = req.user;
            if(role === roles.super){
                const Courses = await coursesService.getCourses()
                res.json(Courses)
            } else if (role === roles.teacher || role === roles.curator){
                const Courses = await coursesService.getMasterHomeworksCourses()
                res.json(Courses)
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
            } else if (role === roles.teacher || role === roles.curator){
                // ///////////////////////////////////////////////////////
                //////////////////////////////////// ПРОВЕРИТЬ
                const Course = await coursesService.getCourseModules(course);
                res.json(Course)
            } else if(role === roles.super) {
                const Course = await coursesService.getCourseModules(course);
                res.json(Course)
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
            const { role, id: user } = req.user;
            if(role === roles.super){
                const Course = await coursesService.getCourse(id)
                const Students = await courseProgressService.getCourseProgresses(id)
                res.json({ ...Course, students: Students })
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
                const Exercises = await lessonsService.getCourseExercises(id)
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
            const { user, isAvailable } = req.body;
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