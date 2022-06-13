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
        const Exercises = await exerciseModel.find()
        return Exercises
    }
    async readOneExercise(exercise){
        const Exercise = await exerciseModel.findById(exercise)
        if(!Exercise){
            throw ApiError.BadRequest("Задание не найдено")
        }
        return Exercise
    }
    async updateExercise(exercise, payload){
        const Exercise = await exerciseModel.findByIdAndUpdate(exercise, payload, { new: true });
        return Exercise
    }
    async deleteExercise(exercise){
        const Exercise = await exerciseModel.findByIdAndDelete(exercise);
        return Exercise
    }

    // get course exercises
    async getCourseExercises(course){
        const Exercises = await exerciseModel.find({ course: course }).populate([
            {
                path: 'lesson',
                select: 'title -_id'
            },
            {
                path: 'module',
                select: 'title -_id'
            }
        ])
        return Exercises.map(ex => new ExerciseDto(ex))
    }
    // get exercise
    async getOneExerciseData(exercise){
        const Exercise = await exerciseModel.findById(exercise).populate([
            {
                path: 'lesson',
                select: 'title -_id'
            },
            {
                path: 'module',
                select: 'title -_id'
            }
        ])
        if(!Exercise){
            throw ApiError.BadRequest("Упражнение не найдено")
        }
        const ExerciseData = new ExerciseDto(Exercise)
        return ExerciseData
    }

    async getLessonExercise(lesson){
        const Exercise = await exerciseModel.findOne({ lesson })
        return Exercise
    }

}


class ExerciseDto {
    constructor(model){
        this.id = model._id
        this.lesson = model.lesson.title
        this.module = model.module.title
        this.course = model.course
    }
}


module.exports = new ExerciseService()