const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const superMiddleware = require('../middlewares/superMiddleware');

const authRouter = require('./authRouter');
const coursesRouter = require('./coursesRouter');
const exerciseRouter = require('./exerciseRouter');
const lessonRouter = require('./lessonRouter');
const notificationRouter = require('./notificationsRouter');
const profileRouter = require('./profileRouter');
const progressRouter = require('./progressRouter');

const usersRouter = require('./usersRouter');

const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);

apiRouter.use('/me',  profileRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/progress', progressRouter);

apiRouter.use('/courses', coursesRouter);

apiRouter.use('/notifications', notificationRouter);

apiRouter.use('/exercise', exerciseRouter)

apiRouter.use('/lesson', lessonRouter);



module.exports = apiRouter;