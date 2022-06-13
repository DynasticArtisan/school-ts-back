const ApiError = require("../exceptions/ApiError")
const moduleProgressService = require("../services/moduleProgressService")
const modulesService = require("../services/modulesService")
const roles = require("../utils/roles")

class ModulesController {
    async createModule(req, res, next){
        try {
            const moduleData = await modulesService.createModule(req.body)
            res.json(moduleData)
        } catch (e) {
            next(e)
        }
    }
    async getModules(req, res, next){
        try {
            const data = await modulesService.getAllModules()
            res.json(data)
        } catch (e) {
            next(e)
        }
    }
    async getOneModule(req, res, next){
        try {
            const { id } = req.params;
            const data = await modulesService.getOneModule(id)
            res.json(data)
        } catch (e) {
            next(e)
        }
    }
    async updateModule(req, res, next){
        try {
            const { id } = req.params;
            const data = await modulesService.updateModule(id, req.body)
            res.json(data)
        } catch (e) {
            next(e)
        }
    }
    async deleteModule(req, res, next){
        try {
            const { id } = req.params;
            await modulesService.deleteModule(id)
            res.json({message:"Запись о модуле удалена"})
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

    async getOneModuleLessons(req, res, next){
        try {
            const { id } = req.params;
            const { role, id: user } = req.user;
            if(role === roles.user){
                const Module = await moduleProgressService.getModuleLessonseProgress(user, id);
                res.json(Module)
            } else if(role === roles.super){
                const Module = await modulesService.getOneModuleData(id)
                res.json(Module)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
}
module.exports = new ModulesController()