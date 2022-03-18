const express = require('express');


const authMiddleware = require('../middlewares/authMiddleware');
const superMiddleware = require('../middlewares/superMiddleware');
const authRouter = require('./authRouter');
const coursesRouter = require('./coursesRouter');
const lessonRouter = require('./lessonRouter');
const superRouter = require('./superRouter');
const usersRouter = require('./usersRouter');

const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', authMiddleware, usersRouter);
apiRouter.use('/super', authMiddleware, superMiddleware, superRouter);
apiRouter.use('/lesson', lessonRouter);
apiRouter.use('/courses', coursesRouter)
module.exports = apiRouter;