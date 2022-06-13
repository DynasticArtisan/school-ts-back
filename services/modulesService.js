const { AdminSingleModuleDto } = require("../dtos/progressDtos")
const courseModel = require("../models/courseModel")
const moduleModel = require("../models/moduleModel")

class ModulesService {
  async createModule(payload){
    const Course = await courseModel.findById(payload.course)
    if(!Course){
      throw ApiError.BadRequest('Курс не найден')
    }
    if(payload.prevModule){
      const PrevModule = await moduleModel.findById(payload.prevModule)
      if(!PrevModule){
        throw ApiError.BadRequest('Предыдущий модуль не найден')
      }
    }
    const Module = await moduleModel.create(payload)
    return Module
  }
  async getAllModules(){
    const Modules = await moduleModel.find();
    return Modules
  }
  async getOneModule(moduleId){
    const Module = await moduleModel.findById(moduleId);
    if(!Module){
      throw ApiError.BadRequest('Модуль не найден')
    }
    return Module
  }
  async updateModule(moduleId, payload){
    const Module = await moduleModel.findByIdAndUpdate(moduleId, payload, {new: true})
    if(!Module){
      throw ApiError.BadRequest('Модуль не найден')
    }
    return Module
  }
  async deleteModule(moduleId){
    const Module = await moduleModel.findByIdAndDelete(moduleId);
    if(!Module){
      throw ApiError.BadRequest('Модуль не найден')
    }
    return Module
  }
  async dropAllModules(){
    const Modules = await moduleModel.deleteMany()
    return Modules
  }

  async getOneModuleData(moduleId){
      const Module = await moduleModel.findById(moduleId).populate('lessons').lean()
      const ModuleData = new AdminSingleModuleDto(Module)
      return ModuleData
  }

}
module.exports = new ModulesService()