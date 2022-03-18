const coursesService = require("../services/coursesService");


class CoursesController {
    async getCoursesData(req, res, next){
        try {
            const { userId } = req.body;
            const coursesData = await coursesService.getUserCoursesData( userId)
            res.json(coursesData);
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
}

module.exports = new CoursesController()