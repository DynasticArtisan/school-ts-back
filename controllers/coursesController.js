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
                const User = await userService.getUser(user)
                if(User.role !== roles.user){
                    next(ApiError.BadRequest("Этот пользователь не может проходить курсы"))
                }
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
                const User = await userService.getUser(user)
                if(User.role !== roles.teacher && User.role !== roles.curator){
                    next(ApiError.BadRequest("Пользователь не является преподавателем или куратором"))
                }
                await coursesService.getCourse(course)
                const Master = await courseMastersService.createMaster({ user, course })
                res.json(Master)
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
                const Courses = await coursesService.getMasterHomeworksCourses(user)
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
                const Master = await courseMastersService.getMaster({ user, course })
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
            } else if(role === roles.teacher){
                await courseMastersService.getMaster({ user, course:id })
                const Course = await coursesService.getCourse(id)
                const Students = await courseProgressService.getCourseProgresses(id)
                res.json({ ...Course, students: Students.filter(progress => progress.isAvailable) })
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
            } else if(role === roles.teacher || role === roles.curator) {
                await courseMastersService.getMaster({ user, course: id })
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
    async updateCourseProgressAccess(req, res, next){
        try {
            const { id } = req.params;
            const { role } = req.user;
            const { isAvailable } = req.body;
            if(role === roles.super){
                if(progress){
                    const Progress = await courseProgressService.updateProgress({ user, course}, progress)
                    res.json({ progress: Progress })
                }
                else if(mastering){
                    const Master = await courseMastersService.updateMaster({ user, course }, mastering)
                    res.json({ mastering: Master })
                } else {
                    next(ApiError.BadRequest("Некоррекный запрос"))
                }
            
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async updateProgressAccess(req, res, next){
        try {
            const { id } = req.params;
            const { role } = req.user;
            const { isAvailable } = req.body;
            if(role === roles.super){
                const Progress = await courseProgressService.updateProgress(id, { isAvailable })
                res.json(Progress)          
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async updateMasterAccess(req, res, next){
        try {
            const { id } = req.params;
            const { role } = req.user;
            const { isAvailable } = req.body;
            if(role === roles.super){
                const Progress = await courseMastersService.updateMaster(id, { isAvailable })
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
}

module.exports = new CoursesController()