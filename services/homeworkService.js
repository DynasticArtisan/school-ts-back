const ApiError = require("../exceptions/ApiError")
const exerciseModel = require("../models/exerciseModel")
const homeworkModel = require("../models/homeworkModel")

class HomeworkService {
    async createHomework(payload){
        const Exercise = await exerciseModel.findById(payload.exercise)
        if(!Exercise){
            throw ApiError.BadRequest("Exercise not found")
        }
        const Homework = await homeworkModel.create({ ...payload, course: Exercise.course, status:"wait" });
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


    async getAllExerciseHomeworks(exercise){
        const Homeworks = await homeworkModel.find({ exercise }).populate('user').lean()
        const HomeworksData = Homeworks.map(hw => new HomeworkDto(hw) ) 
        return HomeworksData
    }
    async getOneHomework(homework){
        const Homework = await homeworkModel.findById(homework).populate([
            {
                path: "user",
                select: "name surname -_id"
            },
            {
                path: "lastfile"
            }
        ]).lean()
        if(!Homework){
            throw ApiError.BadRequest("Домашнее задание не найдено")
        }
        return new HomeworkDto(Homework)
    }
    async getUserHomework(exercise, user){
        const Homework = await homeworkModel.findOne({exercise, user}).populate({
            path: "files"
        }).lean()
        if(!Homework){
            return null
        }
        return Homework
        return new HomeworkDto(Homework)
    }


}

class HomeworkDto { 
    constructor(model){
        this.id = model._id
        this.status = model.status
        this.user = model.user.surname + " " + model.user.name
        this.files = model.files
        this.file = model.lastfile
        this.exercise = model.exercise
    }
}



module.exports = new HomeworkService()