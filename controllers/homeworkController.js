const ApiError = require("../exceptions/ApiError")
const fileService = require("../services/fileService")
const homeworkService = require("../services/homeworkService");
const coursesService = require("../services/coursesService");
const roles = require("../utils/roles");

class HomeworkController {
    async createNewHomework(req, res, next){
        try {
            if(!req.file){
                throw ApiError.BadRequest("Ошибка в записи файла")
            }
            const Homework = await homeworkService.createHomework(req.body);
            const File = await fileService.createHomeworkFile({ homework: Homework._id, filename: req.file.originalname, filepath: 'homeworks/'+req.file.filename });
            res.json(Homework._id)
        } catch (e) {
            next(e)
        }
    }
    async getAllHomeworks(req, res, next){
        try {
            const Homeworks = await homeworkService.readAllHomeworks(req.query)
            res.json(Homeworks)     
        } catch (e) {
            next(e)
        }

    }
    async getOneHomework(req, res, next){
        try {
            const { id } = req.params;
            const { role, id: user } = req.user;
            if(role === roles.super){
                const Homework = await homeworkService.getOneHomework(id)
                res.json(Homework)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async updateHomework(req, res, next){
        try {
            const { id } = req.params;
            const Homework = await homeworkService.updateHomework(id, req.body)
            res.json(Homework)
        } catch (e) {
            next(e)
        }
    }
    async deleteHomework(req, res, next){
        try {
            const { id } = req.params;
            const Homework = await homeworkService.deleteHomework(id)
            res.json("Домашнее задание удалено")
        } catch (e) {
            next(e)
        }
    }

    async uploadNewFile(req, res, next){
        try {
            const { homework } = req.params;
            if(!req.file){
                throw ApiError.BadRequest("Ошибка в записи файла")
            }
            const File = await fileService.createHomeworkFile({ homework, filename: req.file.originalname, filepath: 'homeworks/'+req.file.filename });
            if(!File){
                throw ApiError.BadRequest("Ошибка в записи файла")
            }
            const Homework = await homeworkService.updateHomework( homework, { status: "wait" } )
            res.json(File)
        } catch (e) {
            next(e)
        }
    }

}
module.exports = new HomeworkController()