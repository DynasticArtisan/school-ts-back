const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const homeworkController = require("../controllers/homeworkController");

const homeworkRouter = express.Router();

homeworkRouter.get('/:id', homeworkController.getHomework)
homeworkRouter.put('/:id/accept', authMiddleware, homeworkController.acceptHomework)
homeworkRouter.put('/:id/reject', authMiddleware, homeworkController.rejectHomework)

module.exports = homeworkRouter;