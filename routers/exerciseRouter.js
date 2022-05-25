const express = require("express");
const exerciseController = require("../controllers/exerciseController");

const exerciseRouter = express.Router();

exerciseRouter.post('/', exerciseController.createExercise)
exerciseRouter.get('/', exerciseController.getAllExercise)
exerciseRouter.put('/:exercise', exerciseController.updateExercise)
exerciseRouter.delete('/:exercise', exerciseController.deleteExercise)

module.exports = exerciseRouter;