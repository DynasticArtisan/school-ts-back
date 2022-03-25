const express = require('express');
const coursesController = require('../controllers/coursesController');

const coursesRouter = express.Router();
coursesRouter.get('/', coursesController.getAllCoursesData)
coursesRouter.get('/:userId', coursesController.getUserCoursesData)
coursesRouter.post('/course', coursesController.createCourse)
coursesRouter.post('/module', coursesController.createModule)
coursesRouter.post('/lesson', coursesController.createLesson)
coursesRouter.get('/progress/:userId', coursesController.getUserProgress)
coursesRouter.post('/complete', coursesController.copleteLesson)
module.exports = coursesRouter;