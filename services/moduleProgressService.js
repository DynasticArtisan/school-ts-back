const ApiError = require("../exceptions/ApiError");
const ModuleProgressDto = require("../dtos/ModuleProgressDto");

const moduleProgressModel = require("../models/UMProgressModel");
const lessonProgressService = require("./lessonProgressService");
const courseProgressService = require("./courseProgressService");




const lessonsService = require("./lessonsService");
const { UserSingleModuleProgressDto } = require("../dtos/progressDtos");

class ModuleProgressService {
    async createProgress({ user, module, course }){
        const PrevProgress = await moduleProgressModel.findOne({ user, module })
        if(PrevProgress){
            throw ApiError.BadRequest("Модуль уже доступен пользователю")
        }
        const Progress = await moduleProgressModel.create({ user, module, course })
        const FirstLesson = await lessonsService.getFirstLesson(module)
        await lessonProgressService.createProgress({ user, lesson: FirstLesson.id, module, course })
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





    async getAllProgresses(){
        const Progresses = await moduleProgressModel.find()
        return Progresses
    }
    async getOneProgress(progressID){
        const Progress = await moduleProgressModel.findById(progressID)
        if(!UCProgress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return Progress
    }
    async updateProgress(progressID, payload){
        const Progress = await moduleProgressModel.findByIdAndUpdate(progressID, payload, { new: true })
        if(!UCProgress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return Progress
    }
    async deleteProgress(progressID){
        const Progress = await moduleProgressModel.findByIdAndDelete(progressID)
        if(!UCProgress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return Progress
    }
    async deleteAllProgresses(){
        const Progresses = await moduleProgressModel.deleteMany()
        return Progresses
    }

    async getModuleLessonseProgress(userId, moduleId){
        const UserProgress = await moduleProgressModel.findOne({ user: userId, module: moduleId, isAvailable: true }).select('-_id module').populate(
            {
                path: 'module',
                model: 'Modules',
                populate: {
                        path: 'lessons',
                        select: '-course',
                        populate: {
                            path: 'progress',
                            select: 'isCompleted -_id'
                        }
                    }
                
            }).lean();
        if(!UserProgress){
            throw ApiError.BadRequest('Нет доступа к модулю')
        }
        const UserProgressData = new UserSingleModuleProgressDto(UserProgress)
        return UserProgressData
    }

}
module.exports = new ModuleProgressService()