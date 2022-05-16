const express = require('express');
const coursesController = require('../controllers/coursesController');

const coursesRouter = express.Router();
coursesRouter.get('/', coursesController.getAllCoursesData)
// coursesRouter.get('/:userId', coursesController.getUserCoursesData)


coursesRouter.post('/course', coursesController.createCourse)
coursesRouter.get('/course', coursesController.getCourses)
coursesRouter.get('/course/:courseId', coursesController.getCourse)
coursesRouter.put('/course/:courseId', coursesController.updateCourse)
coursesRouter.delete('/course/:courseId', coursesController.deleteCourse)


coursesRouter.post('/module', coursesController.createModule)
coursesRouter.get('/module', coursesController.getModules)
coursesRouter.get('/module/:moduleId', coursesController.getOneModule)
coursesRouter.put('/module/:moduleId', coursesController.updateModule)
coursesRouter.delete('/module/:moduleId', coursesController.deleteModule)



coursesRouter.post('/lesson', coursesController.createLesson)
coursesRouter.get('/lesson', coursesController.getAllLesson)
coursesRouter.get('/lesson/:lessonId', coursesController.getOneLesson)
coursesRouter.put('/lesson/:lessonId', coursesController.updateLesson)
coursesRouter.delete('/lesson/:lessonId', coursesController.deleteLesson)
coursesRouter.delete('/lesson', coursesController.dropAllLessons)


coursesRouter.get('/progress/:userId', coursesController.getUserProgress)
coursesRouter.post('/complete', coursesController.copleteLesson)
module.exports = coursesRouter;