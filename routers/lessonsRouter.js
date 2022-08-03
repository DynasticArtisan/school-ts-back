const express = require('express');
const lessonsController = require('../controllers/lessonsController');
const homeworkMulter = require('../multer/homeworkMulter');

const lessonsRouter = express.Router();
lessonsRouter.post('/',  lessonsController.createLesson)
lessonsRouter.get('/:id', lessonsController.getLesson)
lessonsRouter.get('/:id/homeworks', lessonsController.getLessonHomeworks)
lessonsRouter.put('/:id', lessonsController.updateLesson)



// Для прохождения урока
lessonsRouter.post('/:id/homeworks', homeworkMulter, lessonsController.createHomework)
lessonsRouter.put('/:id/homeworks', homeworkMulter, lessonsController.updateHomework)
lessonsRouter.put('/:id/complete', lessonsController.completeLesson)

lessonsRouter.delete('/:id', lessonsController.deleteLesson)

// Для очистки базы данных
//lessonsRouter.delete('/', lessonsController.dropAllLessons)



module.exports = lessonsRouter;