const ApiError = require("../exceptions/ApiError");
const courseModel = require("../models/courseModel");

const UCProgressModel = require("../models/UCProgressModel");
const ULProgressModel = require("../models/ULProgressModel");
const UMProgressModel = require("../models/UMProgressModel");

class ProgressService {
    // lessons progress
    async createULProgress(payload) {
        const ULProgress = await ULProgressModel.create(payload);
        return ULProgress
    }
    async getAllULProgress(){
        const ULProgress = await ULProgressModel.find();
        return ULProgress
    }
    async getOneULProgress(progressID){
        const ULProgress = await ULProgressModel.findById(progressID)
        return ULProgress
    }
    async updateULProgress(progressID, payload){
        const ULProgress = await ULProgressModel.findByIdAndUpdate(progressID, payload, { new: true })
        return ULProgress
    }
    async deleteULProgress(progressID){
        const ULProgress = await ULProgressModel.findByIdAndDelete(progressID)
        return ULProgress
    }
    async deleteAllULProgress(){
        const ULProgress = await ULProgressModel.deleteMany()
        return ULProgress
    }

    // modules progress
    async createUMProgress(payload) {
        const UMProgress = await UMProgressModel.create(payload);
        return UMProgress
    }    
    async getAllUMProgress(){
        const UMProgress = await UMProgressModel.find();
        return UMProgress
    }
    async getOneUMProgress(progressID){
        const UMProgress = await UMProgressModel.findById(progressID)
        if(!UMProgress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return UMProgress
    }
    async updateUMProgress(progressID, payload){
        const UMProgress = await UMProgressModel.findByIdAndUpdate(progressID, payload, { new: true })
        if(!UMProgress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return UMProgress
    }
    async deleteUMProgress(progressID){
        const UMProgress = await UMProgressModel.findByIdAndDelete(progressID)
        if(!UMProgress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return UMProgress
    }
    async deleteAllUMProgress(){
        const UMProgress = await UMProgressModel.deleteMany()
        return UMProgress
    }

    //courses progress
    async createUCProgress(payload) {
        const UCProgress = await UCProgressModel.create(payload);
        return UCProgress
    }
    async getAllUCProgress(){
        const UCProgress = await UCProgressModel.find()
        return UCProgress
    }
    async getOneUCProgress(progressID){
        const UCProgress = await UCProgressModel.find(progressID)
        if(!UCProgress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return UCProgress
    }
    async updateUCProgress(progressID, payload){
        const UCProgress = await UCProgressModel.findByIdAndUpdate(progressID, payload)
        if(!UCProgress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return UCProgress
    }
    async deleteUCProgress(progressID){
        const UCProgress = await UCProgressModel.findByIdAndDelete(progressID)
        if(!UCProgress){
            throw ApiError.BadRequest('Прогресс не найден')
        }
        return UCProgress
    }
    async deleteAllUCProgress(){
        const UCProgress = await UCProgressModel.deleteMany()
        return UCProgress
    }

    async getAllUserProgressWithData(userId){
        const Courses = await UCProgressModel.find( { user: userId } ).select('course').populate({
            path: 'course',
            model: 'Courses',
            populate: {
                path: 'modules',
                model: 'Modules',
            }
        })
        return Courses
    }




}

module.exports = new ProgressService()