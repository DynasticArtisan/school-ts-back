const coursesController = require('../controllers/coursesController');
const express = require('express');
const courseMulter = require('../multer/courseMulter');
const coursesRouter = express.Router();

coursesRouter.post('/', courseMulter, coursesController.createCourse);
coursesRouter.get('/progress', coursesController.getProgressCourses);
coursesRouter.get('/homework', coursesController.getHomeworkCourses);

coursesRouter.post('/:id/progress', coursesController.createCourseProgress);
coursesRouter.post('/:id/master', coursesController.createCourseMaster);

coursesRouter.put('/progress/:id/access', coursesController.updateProgressAccess);
coursesRouter.put('/master/:id/access', coursesController.updateMasterAccess);

coursesRouter.get('/:id/modules', coursesController.getCourseModules);
coursesRouter.get('/:id/students', coursesController.getCourseStudents);


coursesRouter.get('/:id/exercises', coursesController.getCourseExercises);
coursesRouter.put('/:id', courseMulter, coursesController.updateCourse)
coursesRouter.delete('/:id', coursesController.deleteCourse)

//coursesRouter.delete('/', coursesController.dropAllCourses)
module.exports = coursesRouter;