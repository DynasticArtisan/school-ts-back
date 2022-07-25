const ApiError = require("../exceptions/ApiError")
const ModuleDto = require("../dtos/ModuleDto")

const moduleModel = require("../models/moduleModel")

class ModulesService {
  async createModule(module){
    if(module.prevModule){
      const PrevModule = await moduleModel.findById(module.prevModule)
      if(!PrevModule){
        throw ApiError.BadRequest('Предыдущий модуль не найден')
      }
    } else {
      const CourseModules = await moduleModel.find({ course: module.course }).populate("nextModule").lean()
      console.log(CourseModules)
      if(CourseModules.length > 0){
        const PrevModule = CourseModules.find((module) => !module.nextModule)
        module.prevModule = PrevModule._id
      } else {
        module.firstModule = true
      }
    }
    const Module = await moduleModel.create(module)
    if(!Module){
      throw ApiError.BadRequest("При создании модуля произошла ошибка")
    }
    return new ModuleDto(Module)
  }

  async getModule(id){
    const Module = await moduleModel.findById(id)
    if(!Module){
      throw ApiError.BadRequest("Модуль не найден")
    }
    return new ModuleDto(Module)
  }

  async getFirstModule(course){
    const Module = await moduleModel.findOne({ course, firstModule:true })
    if(!Module){
      throw ApiError.BadRequest("Модуль не найден")
    }
    return new ModuleDto(Module)
  }

  async getModuleLessons(id){
    const Module = await moduleModel.findById(id).populate({
      path: 'lessons',
      populate: "exercise"
    }).lean()
    if(!Module){
      throw ApiError.BadRequest('Модуль не найден')
    }
    return new ModuleDto(Module)
  }

  async getModuleLessonsProgress(id, user){
    const Module = await moduleModel.findById(id).populate({
      path: 'lessons',
      populate: {
        path: 'progress',
        math: { user }
      }
    })
    if(!Module) {
      throw ApiError.BadRequest('Модуль не найден')
    }
    return new ModuleDto(Module)
  }

  async updateModule(id, module){
    const Module = await moduleModel.findByIdAndUpdate(id, module, {new: true})
    if(!Module){
      throw ApiError.BadRequest('Модуль не найден')
    }
    return Module
  }

  async deleteModule(id){
    const Module = await moduleModel.findById(id);
    if(!Module){
      throw ApiError.BadRequest('Модуль не найден')
    }
    await moduleModel.findOneAndUpdate({ prevModule: Module._id }, { prevModule: Module.prevModule, firstModule: Module.firstModule })
    await moduleModel.findByIdAndDelete(Module._id)
  }
  async deleteCourseModules(course){
    await moduleModel.deleteMany({ course })
  }

  async dropAllModules(){
    const Modules = await moduleModel.deleteMany()
    return Modules
  }



}
module.exports = new ModulesService()