const authMiddleware = require('../middlewares/authMiddleware');
const authRouter = require('./authRouter');
const coursesRouter = require('./coursesRouter');
const modulesRouter = require('./modulesRouter');
const lessonsRouter = require('./lessonsRouter');
const homeworkRouter = require('./homeworkRouter');



const usersRouter = require('./usersRouter');
const filesRouter = require('./filesRouter');
const profileRouter = require('./profileRouter');
const express = require('express');

const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/courses', authMiddleware, coursesRouter);
apiRouter.use('/modules', authMiddleware, modulesRouter);
apiRouter.use('/lessons', authMiddleware, lessonsRouter);
apiRouter.use('/homework', authMiddleware, homeworkRouter);






apiRouter.use('/me', authMiddleware, profileRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/files', filesRouter)





module.exports = apiRouter;