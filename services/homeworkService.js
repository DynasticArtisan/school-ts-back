const ApiError = require("../exceptions/ApiError")
const exerciseModel = require("../models/exerciseModel")
const homeworkModel = require("../models/homeworkModel")
const statuses = require("../utils/statuses")

class HomeworkService {
    async createHomework(payload){
        const Exercise = await exerciseModel.findById(payload.exercise)
        if(!Exercise){
            throw ApiError.BadRequest("Exercise not found")
        }
        const Candidate = await homeworkModel.findOne(payload)
        if(Candidate){
            throw ApiError.BadRequest("Homework allready exist")
        }
        const Homework = await homeworkModel.create({ ...payload, course: Exercise.course, lesson: Exercise.lesson, status:"wait" });
        return new HomeworkDto(Homework)
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

    async getAllExerciseHomeworks(exercise){
        const Homeworks = await homeworkModel.find({ exercise }).populate('user').lean()
        const HomeworksData = Homeworks.map(hw => new HomeworkDto(hw) ) 
        return HomeworksData
    }
    async getOneHomework(homework){
        const Homework = await homeworkModel.findById(homework).populate([
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
    async getUserHomework(exercise, user){
        const Homework = await homeworkModel.findOne({exercise, user}).populate({
            path: "files",
            options: {
                sort: "createdAt"
            }           
        }).lean()
        if(!Homework){
            return null
        }
        //return Homework
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
}

class HomeworkDto { 
    constructor(model){
        this.id = model._id
        this.status = model.status
        if(model.user._id){
            this.user = {
                id: model.user._id,
                fullname: model.user.surname + " " + model.user.name
            }
        } else {
            this.user = model.user
        }
        this.files = model.files
        this.lesson = model.lesson
        this.exercise = model.exercise
        this.comment = model.comment

    }
}



module.exports = new HomeworkService()