const authMiddleware = require('../middlewares/authMiddleware')
const coursesController = require('../controllers/coursesController');
const express = require('express');
const coursesRouter = express.Router();

coursesRouter.get('/progress', coursesController.getProgressCourses);
coursesRouter.get('/homework', coursesController.getHomeworkCourses)
coursesRouter.get('/:id/modules', coursesController.getCourseModules);
coursesRouter.get('/:id/students', coursesController.getOneCourseStudents);
coursesRouter.get('/:id/exercises', coursesController.getCourseExercises);
//служебные
coursesRouter.post('/', coursesController.createCourse)
coursesRouter.get('/', coursesController.getCourses)
coursesRouter.get('/:id', coursesController.getCourse)
coursesRouter.put('/:id', coursesController.updateCourse)
coursesRouter.delete('/:id', coursesController.deleteCourse)
coursesRouter.delete('/', coursesController.dropAllCourses)

module.exports = coursesRouter;