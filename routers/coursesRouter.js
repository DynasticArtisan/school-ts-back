const coursesController = require('../controllers/coursesController');
const express = require('express');
const courseMulter = require('../multer/courseMulter');
const coursesRouter = express.Router();

coursesRouter.post('/', courseMulter, coursesController.createCourse);
coursesRouter.put('/:id', courseMulter, coursesController.updateCourse)

coursesRouter.post('/:id/progress', coursesController.createCourseProgress);
coursesRouter.put('/progress/:id/access', coursesController.updateProgressAccess);

coursesRouter.post('/:id/master', coursesController.createCourseMaster);
coursesRouter.put('/master/:id/access', coursesController.updateMasterAccess);

coursesRouter.get('/progress', coursesController.getProgressCourses);
coursesRouter.get('/homework', coursesController.getHomeworkCourses);

coursesRouter.get('/:id/modules', coursesController.getCourseModules);
coursesRouter.get('/:id/students', coursesController.getCourseStudents);
coursesRouter.get('/:id/exercises', coursesController.getCourseExercises);

coursesRouter.delete('/:id', coursesController.deleteCourse)

module.exports = coursesRouter;