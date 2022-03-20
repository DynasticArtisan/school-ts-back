const express = require('express');
const coursesController = require('../controllers/coursesController');

const coursesRouter = express.Router();
coursesRouter.get('/', coursesController.getAllCoursesData)
coursesRouter.post('/course', coursesController.createCourse)
coursesRouter.post('/module', coursesController.createModule)
coursesRouter.post('/lesson', coursesController.createLesson)
module.exports = coursesRouter;