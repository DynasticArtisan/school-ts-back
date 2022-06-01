const ApiError = require("../exceptions/ApiError")
const { findByIdAndDelete, findByIdAndUpdate } = require("../models/exerciseModel")
const exerciseModel = require("../models/exerciseModel")
const lessonModel = require("../models/lessonModel")

class ExerciseService {
    async createExercise(payload){
        const Lesson = await lessonModel.findById(payload.lesson)
        if(!Lesson){
            throw ApiError.BadRequest("Lesson not found")
        }
        const Exercise = await exerciseModel.create({ ...payload, module: Lesson.module, course: Lesson.course });
        return Exercise
    }

    async readAllExercise(){
        const Exercises = await exerciseModel.find().populate([
            {
                path: 'lesson',
                select: 'title -_id'
            },
            {
                path: 'module',
                select: 'title -_id'
            }
        ])
        return Exercises.map(model => new ExerciseDto(model))
    }

    async readAllCourseExercise(courseId){
        const Exercises = await exerciseModel.find({ course: courseId }).populate([
            {
                path: 'lesson',
                select: 'title -_id'
            },
            {
                path: 'module',
                select: 'title -_id'
            }
        ])
        return Exercises.map(model => new ExerciseDto(model))
    }


    async updateExercise(exercise, payload){
        const Exercise = await exerciseModel.findByIdAndUpdate(exercise, payload, { new: true });
        return Exercise
    }

    async deleteExercise(exercise){
        const Exercise = await exerciseModel.findByIdAndDelete(exercise);
        return Exercise
    }

}


class ExerciseDto {
    constructor(model){
        this.id = model._id
        this.lesson = model.lesson.title
        this.module = model.module.title
    }
}


module.exports = new ExerciseService()