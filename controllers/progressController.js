const progressService = require("../services/progressService");
const ApiError = require("../exceptions/ApiError");
const roles = require("../utils/roles");
const courseProgressService = require("../services/courseProgressService");
class ProgressController {
    async unlockCourseToUser(req, res, next){
        try {
            const { user, course } = req.body;
            const Course = await progressService.unlockCourseToUser(course, user)
            res.json(Course)
        } catch (e) {
            next(e)
        }
    }
    async setCourseAccess(req,res,next){
        try {
            const { id } = req.params;
            const { isAvailable } = req.body
            const Progress = await courseProgressService.setCourseAccess(id, isAvailable)
            res.json(Progress)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ProgressController()