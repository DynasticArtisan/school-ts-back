const exerciseService = require("../services/exerciseService");
const roles = require("../utils/roles");
const ApiError = require("../exceptions/ApiError");
const homeworkService = require("../services/homeworkService");

class ExerciseController {
    async createExercise(req, res, next) {
        try {
            const ExerciseData = await exerciseService.createExercise(req.body)
            res.json(ExerciseData)            
        } catch (e) {
            next(e)
        }
    }
    async getAllExercise(req, res, next) {
        try {
            const ExerciseData = await exerciseService.readAllExercise()
            res.json(ExerciseData)            
        } catch (e) {
            next(e)
        }
    }
    async getOneExercise(req, res, next) {
        try {
            const { id } = req.params;
            const Exercise = await exerciseService.readOneExercise(id)
            res.json(Exercise)
        } catch (e) {
            next(e)
        }
    }
    async updateExercise(req, res, next) {
        try {
            const { id } = req.params;
            const ExerciseData = await exerciseService.updateExercise(id, req.body)
            res.json(ExerciseData)
        } catch (e) {
            next(e)
        }
    }
    async deleteExercise(req, res, next) {
        try {
            const { id } = req.params;
            await exerciseService.deleteExercise(id)
            res.json("Задание удалено")
        } catch (e) {
            next(e)
        }
    }
    async deleteAllExercises(req, res, next){
        try {
            const exercises = await exerciseService.deleteAllExercise()
            res.json(exercises)
        } catch (e) {
            next(e)
        }
    }

    async getOneExerciseHomeworks(req, res, next) {
        try {
            const { id } = req.params;
            const { role, id:user } = req.user;
            if(role === roles.super){
                const Exercise = await exerciseService.getOneExerciseData(id)
                const Homeworks = await homeworkService.getAllExerciseHomeworks(id)
                res.json({ ...Exercise, homeworks: Homeworks  })
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }    
}
module.exports = new ExerciseController()