const ApiError = require("../exceptions/ApiError")
const homeworkModel = require("../models/homeworkModel")
const HomeworkDto = require("../dtos/HomeworkDto")
const homeworkVerifiesModel = require("../models/homeworkVerifiesModel")
const homeworkFilesModel = require("../models/homeworkFilesModel")

class HomeworkService {
    async createHomework(payload, file){
        const PrevHomework = await homeworkModel.findOne(payload)
        if(PrevHomework){
            throw ApiError.BadRequest("Домашнее задание уже было создано")
        }
        const Homework = await homeworkModel.create(payload);
        const File = await homeworkFilesModel.create({...file, homework: Homework._id});
        Homework.files = [File]
        return new HomeworkDto(Homework)
    }

    async updateHomework(homework, payload, file) {
        const Homework = await homeworkModel.findOneAndUpdate(homework, payload, { new: true }).populate("files")
        if(!Homework){
            throw ApiError.BadRequest("Домашнее задание не найдено")
        }
        const File = await homeworkFilesModel.create({...file, homework: Homework._id});
        Homework.files = [...Homework.files, File]
        return new HomeworkDto(Homework)
    }
    async verifyHomework(homework, data, user) {
        const Homework = await homeworkModel.findByIdAndUpdate(homework, data, { new: true })
        if(!Homework){
            throw ApiError.BadRequest("Домашнее задание не найдено")
        }
        const Verified = await homeworkVerifiesModel.findOne({ homework, user })
        if(!Verified){
            await homeworkVerifiesModel.create({ homework, user, course: Homework.course })
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

}




module.exports = new HomeworkService()