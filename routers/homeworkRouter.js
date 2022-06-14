const express = require("express");
const homeworkController = require("../controllers/homeworkController");
const homeworkMulter = require("../multer/homeworkMulter");
const authMiddleware = require("../middlewares/authMiddleware")
const homeworkRouter = express.Router();

homeworkRouter.get('/', homeworkController.getAllHomeworks)
homeworkRouter.put('/:id', homeworkController.updateHomework)
homeworkRouter.delete('/:id', homeworkController.deleteHomework)


homeworkRouter.get('/:id', authMiddleware, homeworkController.getOneHomework)
homeworkRouter.post('/', authMiddleware, homeworkMulter, homeworkController.createNewHomework)
homeworkRouter.put('/:id/check', authMiddleware, homeworkController.checkHomework)
homeworkRouter.put('/:id/file', authMiddleware, homeworkMulter, homeworkController.uploadNewFile)




module.exports = homeworkRouter;