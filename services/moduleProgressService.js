const { UserSingleModuleProgressDto } = require("../dtos/progressDtos");
const ApiError = require("../exceptions/ApiError");
const moduleProgressModel = require("../models/UMProgressModel");

class ModuleProgressService {
    async createProgress(payload) {
        const Progress = await moduleProgressModel.create(payload);
        return Progress
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