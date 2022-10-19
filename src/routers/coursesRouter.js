const coursesController = require('../controllers/coursesController');
const express = require('express');
const courseMulter = require('../multer/courseMulter');
const { default: OnlySuperMiddleware } = require('src/middlewares/onlySuperMiddleware');
const coursesRouter = express.Router();

coursesRouter.post('/', OnlySuperMiddleware, courseMulter, coursesController.createCourse);
coursesRouter.put('/:id', OnlySuperMiddleware, courseMulter, coursesController.updateCourse);
coursesRouter.delete('/:id', OnlySuperMiddleware, coursesController.deleteCourse);

coursesRouter.post('/:id/progress', OnlySuperMiddleware, coursesController.createCourseProgress);
coursesRouter.put('/progress/:id/access', OnlySuperMiddleware, coursesController.updateProgressAccess);

coursesRouter.post('/:id/master', OnlySuperMiddleware, coursesController.createCourseMaster);
coursesRouter.put('/master/:id/access', OnlySuperMiddleware, coursesController.updateMasterAccess);



coursesRouter.get('/progress', coursesController.getProgressCourses);
coursesRouter.get('/homework', coursesController.getHomeworkCourses);
coursesRouter.get('/:id/modules', coursesController.getCourseModules);
coursesRouter.get('/:id/students', coursesController.getCourseStudents);
coursesRouter.get('/:id/exercises', coursesController.getCourseExercises);


module.exports = coursesRouter;