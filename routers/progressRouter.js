const express = require('express');
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middlewares/authMiddleware');
const superMiddleware = require('../middlewares/superMiddleware');
const progressRouter = express.Router();

progressRouter.post('/', authMiddleware,  progressController.unlockCourseToUser)
progressRouter.put('/:id/access', authMiddleware, progressController.setCourseAccess)

module.exports = progressRouter;