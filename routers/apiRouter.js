const authMiddleware = require('../middlewares/authMiddleware');

const authRouter = require('./authRouter');
const usersRouter = require('./usersRouter');
const coursesRouter = require('./coursesRouter');
const modulesRouter = require('./modulesRouter');
const lessonsRouter = require('./lessonsRouter');
const homeworkRouter = require('./homeworkRouter');

const express = require('express');
const UCProgressModel = require('../models/UCProgressModel');
const UMProgressModel = require('../models/UMProgressModel');
const ULProgressModel = require('../models/ULProgressModel');

const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', authMiddleware, usersRouter);
apiRouter.use('/courses', authMiddleware, coursesRouter);
apiRouter.use('/modules', authMiddleware, modulesRouter);
apiRouter.use('/lessons', authMiddleware, lessonsRouter);
apiRouter.use('/homework', authMiddleware, homeworkRouter);



apiRouter.delete("/temp", async function(req, res, next){
    await UCProgressModel.deleteMany()
    await UMProgressModel.deleteMany()
    await ULProgressModel.deleteMany()
    res.json("DELETED")
})





module.exports = apiRouter;