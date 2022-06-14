const progressService = require("../services/progressService");
const ApiError = require("../exceptions/ApiError");
const roles = require("../utils/roles");
const courseProgressService = require("../services/courseProgressService");
const lessonProgressService = require("../services/lessonProgressService");
const moduleProgressService = require("../services/moduleProgressService");
class ProgressController {
    async unlockCourseToUser(req, res, next){
        try {
            const { role } = req.user;
            const { user, course } = req.body;
            if(role === roles.super){
                const Course = await progressService.unlockCourseToUser(course, user)
                res.json(Course)
            } else {
                next(ApiError.Forbidden())
            }

        } catch (e) {
            next(e)
        }
    }
    async setCourseAccess(req,res,next){
        try {
            const { id } = req.params;
            const {role} = req.user;
            const { isAvailable } = req.body
            if(role === roles.super){
                const Progress = await courseProgressService.setCourseAccess(id, isAvailable)
                res.json(Progress)
            } else {
                next(ApiError.Forbidden())
            }

        } catch (e) {
            next(e)
        }
    }
    async deleteAll (req, res, next){
        try {
            await lessonProgressService.deleteAllProgresses()
            await moduleProgressService.deleteAllProgresses()
            await courseProgressService.deleteAllProgresses()
            res.json("Nice!")
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ProgressController()