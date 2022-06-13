const express = require("express");
const homeworkController = require("../controllers/homeworkController");
const homeworkMulter = require("../multer/homeworkMulter");
const authMiddleware = require("../middlewares/authMiddleware")
const homeworkRouter = express.Router();

homeworkRouter.post('/', homeworkMulter, homeworkController.createNewHomework)
homeworkRouter.get('/', homeworkController.getAllHomeworks)
homeworkRouter.get('/:id', authMiddleware, homeworkController.getOneHomework)
homeworkRouter.put('/:id', homeworkController.updateHomework)
homeworkRouter.put('/:id/file', homeworkMulter, homeworkController.uploadNewFile)
homeworkRouter.delete('/:id', homeworkController.deleteHomework)





module.exports = homeworkRouter;