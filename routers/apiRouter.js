const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const superMiddleware = require('../middlewares/superMiddleware');
const authRouter = require('./authRouter');
const coursesRouter = require('./coursesRouter');
const lessonRouter = require('./lessonRouter');
const notificationRouter = require('./notificationsRouter');
const profileRouter = require('./profileRouter');
const superRouter = require('./superRouter');
const usersRouter = require('./usersRouter');

const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/me', authMiddleware, profileRouter);


apiRouter.use('/courses', coursesRouter);

apiRouter.use('/notifications', notificationRouter);

apiRouter.use('/lesson', lessonRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/super', authMiddleware, superMiddleware, superRouter);

module.exports = apiRouter;