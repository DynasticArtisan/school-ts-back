const ApiError = require("../exceptions/ApiError");
const CourseMasterDto = require("../dtos/CourseMasterDto");
const courseMastersModel = require("../models/courseMastersModel");

class CourseMastersService {
    async createMaster({ user, course }){
        const PrevMaster = await courseMastersModel.findOne({ user, course })
        if(PrevMaster){
            throw new ApiError.BadRequest("Курс уже доступен пользователю")
        }
        const Master = await courseMastersModel.create({ user, course })
        return new CourseMasterDto(Master)

    }
    async updateMaster({ user, course }, payload){
        const Master = await courseMastersModel.findOneAndUpdate({ course, user }, payload, { new: true })
        if(!Master){
            throw ApiError.BadRequest('Доступ к курсу не найден')
        }
        return new CourseMasterDto(Master)
    }
    async getMaster({ user, course }){
        const Master = await courseMastersModel.findOne({ user, course })
        if(!Master){
            throw ApiError.BadRequest('Доступ к курсу не найден')
        }
        return new CourseMasterDto(Master)
    }
}
module.exports = new CourseMastersService()