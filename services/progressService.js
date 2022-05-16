const { populate } = require("../models/courseModel");
const courseModel = require("../models/courseModel");
const lessonModel = require("../models/lessonModel");
const moduleModel = require("../models/moduleModel");
const UCProgressModel = require("../models/UCProgressModel");
const ULProgressModel = require("../models/ULProgressModel");
const UMProgressModel = require("../models/UMProgressModel");

class ProgressService {
    // lessons
    async getAllULProgress(){
        const ULProgress = await ULProgressModel.find();
        return ULProgress
    }

    async createULProgress(userID, lessonID, moduleProgressID) {
        const ULProgress = await ULProgressModel.create({ user: userID, lesson: lessonID, module: moduleProgressID });
        return ULProgress
    }

    async readULProgress(userID, lessonID) {
        const ULProgress = await ULProgressModel.findOne({ user: userID, lesson: lessonID });
        return ULProgress
    }

    async deleteULProgress(userID, lessonID) {
        const ULProgress = await ULProgressModel.deleteOne({ user: userID, lesson: lessonID });
        return ULProgress
    }

    // modules
    async getAllUMProgress(){
        const UMProgress = await UMProgressModel.find().populate({
            path: 'lessons',
            model: ULProgressModel
          });
        return UMProgress
    }

    async createUMProgress(userID, moduleID, courseProgressID) {
        const UMProgress = await UMProgressModel.create({ user: userID, module: moduleID, course: courseProgressID });
        return UMProgress
    }

    async readUMProgress(userID, moduleID) {
        const UMProgress = await UMProgressModel.findOne({ user: userID, module: moduleID });
        return UMProgress
    }

    async deleteUMProgress(userID, moduleID) {
        const UMProgress = await UMProgressModel.deleteOne({ user: userID, module: moduleID });
        return UMProgress
    }

    //courses 
    async getAllUCProgress(){
        const UCProgress = await UCProgressModel.find().populate([{
            path: 'modules',
            model: UMProgressModel,
            select: 'module lessons isComplited',
            populate: [
                {
                    path: 'lessons',
                    model: ULProgressModel,
                    select: 'lesson isComplited',
                    populate: {
                        path: 'lesson',
                        model: lessonModel,
                        select:'title description'
                    }
                },
                {
                    path: 'module',
                    model: moduleModel,
                    select:'title description'
                }
            ]
        },
        {
            path: 'course',
            model: courseModel,
            select:'title subtitle description image'
        }])
        return UCProgress
    }

    async createUCProgress(userID, courseID) {
        const UCProgress = await UCProgressModel.create({ user: userID, course: courseID });
        return UCProgress
    }

    async readUCProgress(userID, courseID) {
        const UCProgress = await UCProgressModel.findOne({ user: userID, course: courseID });
        return UCProgress
    }

    async deleteUCProgress(userID, courseID) {
        const UCProgress = await UCProgressModel.deleteOne({ user: userID, course: courseID });
        return UCProgress
    }



    // progress
    async createUserProgress(userID, courseID){
        const Course = await courseModel.findById(courseID).populate({
            path: 'modules',
            model: moduleModel,
          })
        if(!Course){
            throw ApiError.BadRequest('Неверный запрос')
        }
        const Progress = await this.createUCProgress(userID, courseID);

        for (const module of Course.modules) {
            const ModuleProgress = await this.createUMProgress(userID, module._id, Progress._id);
            for (const lesson of module.lessons){
                const LessonProgress = await this.createULProgress(userID, lesson, ModuleProgress._id);
                ModuleProgress.lessons.push(LessonProgress._id);
            }
            await ModuleProgress.save();
            Progress.modules.push(ModuleProgress._id);
          }

        await Progress.save()
        return Progress;
    }

    async dropAllProgress(){
        await UCProgressModel.deleteMany()
        await UMProgressModel.deleteMany()
        await ULProgressModel.deleteMany()
    }
}

module.exports = new ProgressService()