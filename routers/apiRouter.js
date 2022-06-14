const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const superMiddleware = require('../middlewares/superMiddleware');

const authRouter = require('./authRouter');

const coursesRouter = require('./coursesRouter');
const modulesRouter = require('./modulesRouter');
const lessonsRouter = require('./lessonsRouter');

const exerciseRouter = require('./exerciseRouter');
const filesRouter = require('./filesRouter');
const homeworkRouter = require('./homeworkRouter');
const notificationRouter = require('./notificationsRouter');
const profileRouter = require('./profileRouter');
const progressRouter = require('./progressRouter');

const usersRouter = require('./usersRouter');

const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);

apiRouter.use('/me', authMiddleware, profileRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/progress', progressRouter);

apiRouter.use('/courses', authMiddleware, coursesRouter);
apiRouter.use('/modules', authMiddleware, modulesRouter);
apiRouter.use('/lessons', authMiddleware, lessonsRouter);
apiRouter.use('/exercise', exerciseRouter);
apiRouter.use('/homework', homeworkRouter);
apiRouter.use('/files', filesRouter)


apiRouter.use('/notifications', notificationRouter);



module.exports = apiRouter;