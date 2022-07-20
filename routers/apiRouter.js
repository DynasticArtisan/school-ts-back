const authMiddleware = require('../middlewares/authMiddleware');

const authRouter = require('./authRouter');
const usersRouter = require('./usersRouter');
const coursesRouter = require('./coursesRouter');
const modulesRouter = require('./modulesRouter');
const lessonsRouter = require('./lessonsRouter');
const homeworkRouter = require('./homeworkRouter');

const express = require('express');

const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', authMiddleware, usersRouter);
apiRouter.use('/courses', authMiddleware, coursesRouter);
apiRouter.use('/modules', authMiddleware, modulesRouter);
apiRouter.use('/lessons', authMiddleware, lessonsRouter);
apiRouter.use('/homework', authMiddleware, homeworkRouter);

module.exports = apiRouter;