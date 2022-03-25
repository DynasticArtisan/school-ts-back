const express = require('express');
const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../middlewares/authMiddleware');


const lessonRouter = express.Router();
lessonRouter.get('/:lessonId', authMiddleware, lessonController.getLesson)
lessonRouter.get('/videos/:video', lessonController.getVideo)
module.exports = lessonRouter;