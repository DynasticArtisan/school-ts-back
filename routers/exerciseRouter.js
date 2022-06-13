const express = require("express");
const exerciseController = require("../controllers/exerciseController");
const authMiddleware = require('../middlewares/authMiddleware')

const exerciseRouter = express.Router();
exerciseRouter.post('/', exerciseController.createExercise)
exerciseRouter.get('/', exerciseController.getAllExercise)
exerciseRouter.get('/:id', exerciseController.getOneExercise)
exerciseRouter.get('/:id/homeworks', authMiddleware, exerciseController.getOneExerciseHomeworks)
exerciseRouter.put('/:id', exerciseController.updateExercise)
exerciseRouter.delete('/:id', exerciseController.deleteExercise)

module.exports = exerciseRouter;