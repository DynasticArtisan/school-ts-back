const ApiError = require("../exceptions/ApiError");
const ModuleProgressDto = require("../dtos/ModuleProgressDto");

const moduleProgressModel = require("../models/UMProgressModel");
const lessonProgressService = require("./lessonProgressService");
const courseProgressService = require("./courseProgressService");

const lessonsService = require("./lessonsService");


class ModuleProgressService {
    async createProgress({ user, module, course }){
        const PrevProgress = await moduleProgressModel.findOne({ user, module })
        if(PrevProgress){
            throw ApiError.BadRequest("Модуль уже доступен пользователю")
        }
        const Progress = await moduleProgressModel.create({ user, module, course })
        const FirstLesson = await lessonsService.getFirstLesson(module)
        // ПОЧЕМУ НЕ РАБОТАЕТ ?!
        //await lessonProgressService.createProgress({ user, lesson: FirstLesson.id, module, course })
        return new ModuleProgressDto(Progress)
    }

    async getProgress({ user, module }){
        const Progress = await moduleProgressModel.findOne({ user, module })
        if(!Progress){
            throw ApiError.BadRequest('Прогресс пользователя не найден')
        }
        return new ModuleProgressDto(Progress)
    }
    async completeProgress({ user, module }){
        const Progress = await moduleProgressModel.findOneAndUpdate({ user, module }, { isCompleted: true }, { new: true }).populate({
            path: "module",
            populate: "nextModule"
        }).lean()
        if(!Progress){
            throw ApiError.BadRequest('Прогресс пользователя не найден')
        }
        try {
            if(Progress.module.nextModule){
                await this.createProgress({ user, module: Progress.module.nextModule,  course: Progress.module.course })
            } else {
                await courseProgressService.completeProgress({ user, course: Progress.module.course })
            }
        } catch (error) {
            
        } finally {
            return new ModuleProgressDto(Progress)
        }
    }


    async deleteUserProgresses(user){
        await moduleProgressModel.deleteMany({ user })
    }


}
module.exports = new ModuleProgressService()