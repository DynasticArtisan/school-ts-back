const ApiError = require("../exceptions/ApiError");
const CourseMasterDto = require("../dtos/courseMasterDto");
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
}
module.exports = new CourseMastersService()