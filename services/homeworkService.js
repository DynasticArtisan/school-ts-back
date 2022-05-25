const ApiError = require("../exceptions/ApiError")
const exerciseModel = require("../models/exerciseModel")
const lessonModel = require("../models/lessonModel")

class HomeworkService {
    // async createHomework(payload){
    //     const Lesson = await lessonModel.findById(payload.lesson)
    //     if(!Lesson){
    //         throw ApiError.BadRequest("Lesson not found")
    //     }
    //     const Exercise = await exerciseModel.create({ ...payload, module: Lesson.module });
    //     return Exercise
    // }

    // async readAllExercise(){
    //     const Exercises = await exerciseModel.find().populate([
    //         {
    //             path: 'lesson',
    //             select: 'title -_id'
    //         },
    //         {
    //             path: 'module',
    //             select: 'title -_id'
    //         }
    //     ])
    //     return Exercises.map(model => new ExerciseDto(model))
    // }

    // async updateExercise(exercise, payload){
    //     const Exercise = await exerciseModel.findByIdAndUpdate(exercise, payload, { new: true });
    //     return Exercise
    // }

    // async deleteExercise(exercise){
    //     const Exercise = await exerciseModel.findByIdAndDelete(exercise);
    //     return Exercise
    // }

}





module.exports = new HomeworkService()