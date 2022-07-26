const ApiError = require("../exceptions/ApiError")
const statuses = require("../utils/statuses")
const homeworkModel = require("../models/homeworkModel")
const HomeworkDto = require("../dtos/HomeworkDto")
const homeworkVerifiesModel = require("../models/homeworkVerifiesModel")

class HomeworkService {
    async createHomework(payload){
        const PrevHomework = await homeworkModel.findOne(payload)
        if(PrevHomework){
            throw ApiError.BadRequest("Домашнее задание уже было создано")
        }
        const Homework = await homeworkModel.create(payload);
        return new HomeworkDto(Homework)
    }
    async updateHomework(homework, payload) {
        const Homework = await homeworkModel.findOneAndUpdate(homework, payload, { new: true })
        if(!Homework){
            throw ApiError.BadRequest("Домашнее задание не найдено")
        }
        return new HomeworkDto(Homework)
    }
    async verifyHomework(homework, data, user) {
        const Homework = await homeworkModel.findByIdAndUpdate(homework, data, { new: true })
        if(!Homework){
            throw ApiError.BadRequest("Домашнее задание не найдено")
        }
        const Verified = await homeworkVerifiesModel.findOne({ homework, user })
        if(!Verified){
            await homeworkVerifiesModel.create({ homework, user })
        }
        return new HomeworkDto(Homework)
    }

    async getLessonHomeworks(lesson){
        const Homeworks = await homeworkModel.find({ lesson }).populate('user').lean()
        return Homeworks.map(homework => new HomeworkDto(homework)) 
    }
    async getHomework(id){
        const Homework = await homeworkModel.findById(id).populate([
            {
                path: "user",
                select: "name surname"
            },
            {
                path: "files",
                options: {
                    sort: "createdAt"
                }    
            }
        ]).lean()
        if(!Homework){
            throw ApiError.BadRequest("Домашнее задание не найдено")
        }
        return new HomeworkDto(Homework)
    }


    async checkHomework(_id, payload){
        const Homework = await homeworkModel.findOneAndUpdate({ _id, status: statuses.wait }, payload, {new: true}).populate([
            {
                path: "user",
                select: "name surname"
            },
            {
                path: "files",
                options: {
                    sort: "createdAt"
                }    
            }
        ]).lean()
        if(!Homework){
            throw ApiError.BadRequest("Задание не найдено")
        }
        return new HomeworkDto(Homework)
    }




    async deleteHomework(homework) {
        const Homework = await homeworkModel.findByIdAndDelete(homework)
        if(!Homework){
            throw ApiError.BadRequest("Домашнее задание не найдено")
        }
        return Homework
    }
    async deleteAllHomeworks(){
        const Homeworks = await homeworkModel.deleteMany()
        return Homeworks
    }


}




module.exports = new HomeworkService()