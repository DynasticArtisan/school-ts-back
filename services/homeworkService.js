const ApiError = require("../exceptions/ApiError")
const exerciseModel = require("../models/exerciseModel")
const homeworkModel = require("../models/homeworkModel")

class HomeworkService {
    async createHomework(payload){
        const Exercise = await exerciseModel.findById(payload.exercise)
        if(!Exercise){
            throw ApiError.BadRequest("Exercise not found")
        }
        const Homework = await homeworkModel.create({ ...payload, status:"wait" });
        return Homework
    }

    async readAllHomeworks(options){
        const Homeworks = await homeworkModel.find(options)
        return Homeworks
    }

    async readSingleHomework(homework){
        const Homework = await homeworkModel.findById(homework).populate('files').lean()
        if(!Homework){
            throw ApiError.BadRequest("Домашнее задание не найдено")
        }
        return Homework
    }

    async updateHomework(homework, payload) {
        const Homework = await homeworkModel.findByIdAndUpdate(homework, payload, { new: true })
        if(!Homework){
            throw ApiError.BadRequest("Домашнее задание не найдено")
        }
        return Homework
    }

    async deleteHomework(homework) {
        const Homework = await homeworkModel.findByIdAndDelete(homework)
        if(!Homework){
            throw ApiError.BadRequest("Домашнее задание не найдено")
        }
        return Homework
    }

}





module.exports = new HomeworkService()