const ApiError = require("../exceptions/ApiError")
const statuses = require("../utils/statuses")
const homeworkModel = require("../models/homeworkModel")
const HomeworkDto = require("../dtos/HomeworkDto")

class HomeworkService {
    async createHomework(payload){
        const Candidate = await homeworkModel.findOne({ exercise: payload.exercise, user: payload.user })
        if(Candidate){
            throw ApiError.BadRequest("Homework allready exist")
        }
        const Homework = await homeworkModel.create(payload);
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
    async updateHomework(homework, payload) {
        const Homework = await homeworkModel.findByIdAndUpdate(homework, payload, { new: true }).populate([
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