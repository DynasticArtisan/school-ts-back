const exerciseService = require("../services/exerciseService");

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

    async updateExercise(req, res, next) {
        try {
            const { exercise } = req.params;
            const ExerciseData = await exerciseService.updateExercise(exercise, req.body)
            res.json(ExerciseData)
        } catch (e) {
            next(e)
        }
    }

    async deleteExercise(req, res, next) {
        try {
            const { exercise } = req.params;
            await exerciseService.deleteExercise(exercise)
            res.json("Задание удалено")
        } catch (e) {
            next(e)
        }
    }

}
module.exports = new ExerciseController()