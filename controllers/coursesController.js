const roles = require("../utils/roles")
const ApiError = require("../exceptions/ApiError");
const coursesService = require("../services/coursesService");
const progressService = require("../services/progressService");
const exerciseService = require("../services/exerciseService");

class CoursesController {
    async getUserCoursesProgress(req, res, next){
        try {
            let coursesData;
            if(req.user.role == "user"){
                coursesData = await progressService.getUserCoursesProgress(req.user.id)
            } else {
                coursesData = await progressService.getTeacherCoursesProgress()
            }
           
            res.json(coursesData)
        } catch (e) {
            next(e)
        }
    }
    async getAdminOneCourseStudents(req, res, next){
        try {
            const { id } = req.params;
            const Students = await progressService.getAdminOneCourseStudents(id)
            res.json(Students)
        } catch (e) {
            next(e)
        }
    }
    async getUserOneCourseProgress(req, res, next){
        try {
            const { id } = req.params;
            let courseData;
            if(req.user.role == "user"){
            courseData = await progressService.getUserOneCourseProgress(req.user.id, id);
            } else {
            courseData = await progressService.getAdminOneCourse(req.user.id, id);
            }
            res.json(courseData)
        } catch (e) {
            next(e)
        }
    }
    async getUserOneModuleProgress(req, res, next){
        try {
            const { id } = req.params;
            let moduleData;
            if(req.user.role == "user"){
                moduleData = await progressService.getUserOneModuleProgress(req.user.id, id);
            } else {
                moduleData = await progressService.getAdminOneModule(req.user.id, id)
            }
            res.json(moduleData)
        } catch (e) {
            next(e)
        }
    }
    // courses list for homeworks courses page
    async getHomeworkPageCourses(req, res, next){
        try {
            const {role} = req.user;
            if(role === roles.user || role === roles.admin){
                next(ApiError.UnauthorizedError)
            }
            const Courses = await coursesService.getAllCoursesData()
            res.json(Courses)
        } catch (e) {
            next(e)
        }
    }
    // single course exercises
    async getCourseExercises(req, res, next){
        try {
            const { role } = req.user;
            const { course } = req.params;
            if(role === roles.super){
                const ExercisesData = await exerciseService.getCourseExercises(course)
                res.json(ExercisesData)
            } else {
                next(ApiError.UnauthorizedError)
            }
        } catch (e) {
            next(e)
        }
    }

    // async getAllCoursesData(req, res, next){
    //     try {
    //         const coursesData = await coursesService.getAllCoursesData()
    //         res.json(coursesData);
    //     } catch (e) {
    //         next(e)
    //     }
    // }

    // async getWholeCoursesProgress(req, res, next){
    //     try {
    //         const coursesData = await coursesService.getWholeCoursesProgress()
    //         res.json(coursesData)
    //     } catch (e) {
    //         next(e)
    //     }
    // }

    // async getUsersProgressesByCourse(req, res, next){
    //     try {
    //         const { course } = req.params;
    //         const progressData = await progressService.getUsersProgressesByCourse(course);
    //         res.json(progressData)
    //     } catch (e) {
    //         next(e)
    //     }
    // }

    // // COURSE CONTROLLER
async createCourse(req, res, next){
    try {
        const data = await coursesService.createCourse( req.body )
        res.json(data)
    } catch (e) {
        next(e)
    }
}
    // async getCourse(req, res, next){
    //     try {
    //         const { courseId } = req.params;
    //         const data = await coursesService.getCourse(courseId)
    //         res.json(data)
    //     } catch (e) {
    //         next(e)
    //     }
    // }
    // async getCourses(req, res, next){
    //     try {
    //         const data = await coursesService.getAllCourses()
    //         res.json(data)
    //     } catch (e) {
    //         next(e)
    //     }
    // }
    async updateCourse(req,res,next){
        try {
            const { courseId } = req.params;
            const data = await coursesService.updateCourse(courseId, req.body)
            res.json(data)
        } catch(e){
            next(e)
        }
    }
    // async deleteCourse(req,res,next){
    //     try {
    //         const { courseId } = req.params;
    //         await coursesService.deleteCourse(courseId)
    //         res.json({ message: "Запись о курсе удалена" })
    //     } catch(e){
    //         next(e)
    //     }
    // }
    // async dropAllCourses(req,res,next){
    //     try {
    //         const data = await coursesService.dropAllCourses()
    //         res.json(data)
    //     } catch (e) {
    //         next(e)
    //     }
    // }

    // // MODULE CONTROLLER

    // async createModule(req, res, next){
    //     try {
    //         // const { urlname, title, description, courseId } = req.body;
    //         const moduleData = await coursesService.createModule(req.body)
    //         res.json(moduleData)
    //     } catch (e) {
    //         next(e)
    //     }
    // }
    // async getModules(req, res, next){
    //     try {
    //         const data = await coursesService.getModules()
    //         res.json(data)
    //     } catch (e) {
    //         next(e)
    //     }
    // }
    // async getOneModule(req, res, next){
    //     try {
    //         const { moduleId } = req.params;
    //         const data = await coursesService.getOneModule(moduleId)
    //         res.json(data)
    //     } catch (e) {
    //         next(e)
    //     }
    // }
    async updateModule(req, res, next){
        try {
            const { moduleId } = req.params;
            const data = await coursesService.updateModule(moduleId, req.body)
            res.json(data)
        } catch (e) {
            next(e)
        }
    }
    // async deleteModule(req, res, next){
    //     try {
    //         const { moduleId } = req.params;
    //         await coursesService.deleteModule(moduleId)
    //         res.json({message:"Запись о модуле удалена"})
    //     } catch (e) {
    //         next(e)
    //     }
    // }
    // async dropAllModules(req,res,next){
    //     try {
    //         const data = await coursesService.dropAllModules()
    //         res.json(data)
    //     } catch (e) {
    //         next(e)
    //     }
    // }

    // // LESSON CONTROLLER

    // async createLesson(req, res, next){
    //     try {
    //         const lessonData = await coursesService.createLesson(req.body)
    //         res.json(lessonData)
    //     } catch (e) {
    //         next(e)
    //     }
    // }
    // async getAllLesson(req, res, next){
    //     try {
    //         const data = await coursesService.getLessons()
    //         res.json(data)
    //     } catch (e) {
    //         next(e)
    //     }
    // }
    // async getOneLesson(req, res, next){
    //     try {
    //         const { lessonId } = req.params;
    //         const { user } = req.query;
    //         const data = await coursesService.getOneLesson(lessonId, user)
    //         res.json(data)
    //     } catch (e) {
    //         next(e)
    //     }
    // }
    async updateLesson(req, res, next){
        try {
            const { lessonId } = req.params;
            const data = await coursesService.updateLesson(lessonId, req.body)
            res.json(data)
        } catch (e) {
            next(e)
        }
    }
    // async deleteLesson(req, res, next){
    //     try {
    //         const { lessonId } = req.params;
    //         await coursesService.deleteLesson(lessonId)
    //         res.json({message:"Запись об уроке удалена"})
    //     } catch (e) {
    //         next(e)
    //     }
    // }
    // async dropAllLessons(req,res,next){
    //     try {
    //         const data = await coursesService.dropAllLessons()
    //         res.json(data)
    //     } catch (e) {
    //         next(e)
    //     }
    // }

}

module.exports = new CoursesController()