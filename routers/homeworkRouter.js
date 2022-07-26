const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const homeworkMulter = require("../multer/homeworkMulter");
const homeworkController = require("../controllers/homeworkController");

const homeworkRouter = express.Router();

homeworkRouter.post('/', homeworkMulter, homeworkController.createNewHomework)
homeworkRouter.get('/:id', homeworkController.getHomework)
homeworkRouter.put('/:id', homeworkMulter, homeworkController.updateHomework)

homeworkRouter.put('/:id/accept', authMiddleware, homeworkController.acceptHomework)
homeworkRouter.put('/:id/reject', authMiddleware, homeworkController.rejectHomework)




module.exports = homeworkRouter;