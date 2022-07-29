const ApiError = require("../exceptions/ApiError");
const lessonsService = require("../services/lessonsService");
const moduleProgressService = require("../services/moduleProgressService")
const modulesService = require("../services/modulesService")
const coursesService = require("../services/coursesService")
const roles = require("../utils/roles");
const courseMastersService = require("../services/courseMastersService");

class ModulesController {
    async createModule(req, res, next){
        try {
            const { role } = req.user;
            const module = req.body;
            if(role === roles.super){
                await coursesService.getCourse(module.course)
                const moduleData = await modulesService.createModule(module)
                res.json(moduleData)
            } else {
                next(ApiError.Forbidden())
            }

        } catch (e) {
            next(e)
        }
    }
    async getModule(req, res, next){
        try {
            const { id } = req.params;
            const { role, id: user } = req.user;
            if(role === roles.user){
                const Progress = await moduleProgressService.getProgress({ user, module: id })
                const Module = await modulesService.getModuleLessonsProgress(id, user)
                res.json({ ...Module, progress: Progress })
            } else if(role === roles.teacher || role === roles.curator){
                const Module = await modulesService.getModuleLessons(id)
                const Master = await courseMastersService.getMaster({ user, course: Module.course})
                res.json(Module)
            } else if(role === roles.super){
                const Module = await modulesService.getModuleLessons(id)
                res.json(Module)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async updateModule(req, res, next){
        try {
            const { id } = req.params;
            const { role } = req.user;
            if(role === roles.super){
                const data = await modulesService.updateModule(id, req.body)
                res.json(data)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async deleteModule(req, res, next){
        try {
            const { id } = req.params;
            const { role } = req.user;
            if(role === roles.super){
                await modulesService.deleteModule(id)
                await lessonsService.deleteModuleLessons(id)
                res.json({ message: "Модуль успешно удален" })
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    

    async dropAllModules(req,res,next){
        try {
            const data = await modulesService.dropAllModules()
            res.json(data)
        } catch (e) {
            next(e)
        }
    }

}
module.exports = new ModulesController()