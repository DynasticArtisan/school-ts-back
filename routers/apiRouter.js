const express = require('express');


const authMiddleware = require('../middlewares/authMiddleware');
const superMiddleware = require('../middlewares/superMiddleware');
const authRouter = require('./authRouter');
const superRouter = require('./superRouter');
const usersRouter = require('./usersRouter');

const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', authMiddleware, usersRouter);
apiRouter.use('/super', authMiddleware, superMiddleware, superRouter);
module.exports = apiRouter;