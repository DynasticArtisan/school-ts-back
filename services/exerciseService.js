const ApiError = require("../exceptions/ApiError")
const exerciseModel = require("../models/exerciseModel")
const ExerciseDto = require("../dtos/ExerciseDto")

class ExerciseService {
    async createExercise(payload){
        const Exercise = await exerciseModel.create(payload);
        return new ExerciseDto(Exercise)
    }
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
        return Exercises.map(exercise => new ExerciseDto(exercise))
    }
    async getLessonExercise(lesson){
        const Exercise = await exerciseModel.findOne({ lesson }).populate([
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
            throw ApiError.BadRequest("Задание не найдено")
        }
        return new ExerciseDto(Exercise)
    }
    async updateExercise(lesson, payload){
        const Exercise = await exerciseModel.findOneAndUpdate({ lesson }, payload, { new: true });
        if(!Exercise){
            throw ApiError.BadRequest("Задание не найдено")
        }
        return Exercise
    }
    async deleteLessonExercise(lesson){
        await exerciseModel.findOneAndDelete({ lesson })
    }






    // async readAllExercise(){
    //     const Exercises = await exerciseModel.find()
    //     return Exercises
    // }
    // async readOneExercise(exercise){
    //     const Exercise = await exerciseModel.findById(exercise)
    //     if(!Exercise){
    //         throw ApiError.BadRequest("Задание не найдено")
    //     }
    //     return Exercise
    // }
    // async deleteExercise(exercise){
    //     const Exercise = await exerciseModel.findByIdAndDelete(exercise);
    //     return Exercise
    // }
    // async deleteAllExercise(){
    //     const Exercise = await exerciseModel.deleteMany();
    //     return Exercise
    // }


    // get exercise


    // async getLessonExercise(lesson){
    //     const Exercise = await exerciseModel.findOne({ lesson })
    //     return Exercise
    // }

}





module.exports = new ExerciseService()