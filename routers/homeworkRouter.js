const express = require("express");
const homeworkController = require("../controllers/homeworkController");
const homeworkMulter = require("../multer/homeworkMulter");

const homeworkRouter = express.Router();

homeworkRouter.post('/', homeworkMulter, homeworkController.createNewHomework)
homeworkRouter.get('/', homeworkController.getAllHomeworks)
homeworkRouter.get('/:homework', homeworkController.getSingleHomework)
homeworkRouter.put('/:homework', homeworkController.updateHomework)
homeworkRouter.put('/:homework/file', homeworkMulter, homeworkController.uploadNewFile)
homeworkRouter.delete('/:homework', homeworkController.deleteHomework)


module.exports = homeworkRouter;