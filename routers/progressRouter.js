const express = require('express');
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middlewares/authMiddleware');
const superMiddleware = require('../middlewares/superMiddleware');
const progressRouter = express.Router();

progressRouter.post('/', progressController.unlockCourseToUser)
progressRouter.put('/:id/access', authMiddleware, superMiddleware, progressController.setCourseAccess)

module.exports = progressRouter;