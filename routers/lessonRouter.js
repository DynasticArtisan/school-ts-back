const express = require('express');
const lessonController = require('../controllers/lessonController');


const lessonRouter = express.Router();
lessonRouter.get('/', lessonController.getLesson)
lessonRouter.get('/video', lessonController.getVideo)

module.exports = lessonRouter;