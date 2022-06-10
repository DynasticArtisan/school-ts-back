const authMiddleware = require('../middlewares/authMiddleware')
const express = require('express');
const coursesController = require('../controllers/coursesController');

const coursesRouter = express.Router();


coursesRouter.get('/homework/', authMiddleware, coursesController.getHomeworkPageCourses)
coursesRouter.get('/', authMiddleware, coursesController.getUserCoursesProgress);
coursesRouter.get('/:id', authMiddleware, coursesController.getAdminOneCourseStudents);
coursesRouter.get('/course/:id', authMiddleware, coursesController.getUserOneCourseProgress);
coursesRouter.get('/:course/exercises', authMiddleware, coursesController.getCourseExercises)
coursesRouter.get('/module/:id', authMiddleware, coursesController.getUserOneModuleProgress);









//coursesRouter.get('/', coursesController.getAllCoursesData)
//coursesRouter.get('/progress', coursesController.getWholeCoursesProgress)
//coursesRouter.get('/progress/:course', coursesController.getUsersProgressesByCourse)


coursesRouter.post('/course', coursesController.createCourse)
//coursesRouter.get('/course', coursesController.getCourses)
//coursesRouter.get('/course/:courseId', coursesController.getCourse)
//coursesRouter.put('/course/:courseId', coursesController.updateCourse)
//coursesRouter.delete('/course/:courseId', coursesController.deleteCourse)
//coursesRouter.delete('/course', coursesController.dropAllCourses)
//
//
//coursesRouter.post('/module', coursesController.createModule)
//coursesRouter.get('/module', coursesController.getModules)
//coursesRouter.get('/module/:moduleId', coursesController.getOneModule)
//coursesRouter.put('/module/:moduleId', coursesController.updateModule)
//coursesRouter.delete('/module/:moduleId', coursesController.deleteModule)
//coursesRouter.delete('/module', coursesController.dropAllModules)
//
//
//coursesRouter.post('/lesson', coursesController.createLesson)
//coursesRouter.get('/lesson', coursesController.getAllLesson)
//coursesRouter.get('/lesson/:lessonId', coursesController.getOneLesson)
//coursesRouter.put('/lesson/:lessonId', coursesController.updateLesson)
//coursesRouter.delete('/lesson/:lessonId', coursesController.deleteLesson)
//coursesRouter.delete('/lesson', coursesController.dropAllLessons)

module.exports = coursesRouter;