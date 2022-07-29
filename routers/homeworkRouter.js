const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const homeworkMulter = require("../multer/homeworkMulter");
const homeworkController = require("../controllers/homeworkController");

const homeworkRouter = express.Router();

homeworkRouter.post('/', homeworkMulter, homeworkController.createNewHomework)
homeworkRouter.put('/', homeworkMulter, homeworkController.updateHomework)

homeworkRouter.get('/:id', homeworkController.getHomework)

homeworkRouter.put('/:id/accept', authMiddleware, homeworkController.acceptHomework)
homeworkRouter.put('/:id/reject', authMiddleware, homeworkController.rejectHomework)




module.exports = homeworkRouter;