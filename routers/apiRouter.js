const authMiddleware = require('../middlewares/authMiddleware');
const express = require('express');

const authRouter = require('./authRouter');
const usersRouter = require('./usersRouter');
const coursesRouter = require('./coursesRouter');
const modulesRouter = require('./modulesRouter');
const lessonsRouter = require('./lessonsRouter');
const homeworkRouter = require('./homeworkRouter');


// УБРАТЬ
const UCProgressModel = require('../models/UCProgressModel');
const UMProgressModel = require('../models/UMProgressModel');
const ULProgressModel = require('../models/ULProgressModel');
const homeworkModel = require('../models/homeworkModel');
const homeworkVerifiesModel = require('../models/homeworkVerifiesModel');
const homeworkFilesModel = require('../models/homeworkFilesModel');
const courseMastersModel = require('../models/courseMastersModel');

const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', authMiddleware, usersRouter);
apiRouter.use('/courses', authMiddleware, coursesRouter);
apiRouter.use('/modules', authMiddleware, modulesRouter);
apiRouter.use('/lessons', authMiddleware, lessonsRouter);
apiRouter.use('/homework', authMiddleware, homeworkRouter);



apiRouter.delete("/progress", async function(req, res, next){
    await UCProgressModel.deleteMany()
    await UMProgressModel.deleteMany()
    await ULProgressModel.deleteMany()
    await courseMastersModel.deleteMany()
    res.json("DELETED")
})

apiRouter.delete("/homeworks", async function(req, res, next){
    await homeworkModel.deleteMany()
    await homeworkFilesModel.deleteMany()
    await homeworkVerifiesModel.deleteMany()
    res.json("DELETED")
})



module.exports = apiRouter;