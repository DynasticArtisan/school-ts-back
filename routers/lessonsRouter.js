const express = require('express');
const lessonsController = require('../controllers/lessonsController');
const homeworkMulter = require('../multer/homeworkMulter');

const lessonsRouter = express.Router();
lessonsRouter.post('/',  lessonsController.createLesson)
lessonsRouter.put('/:id', lessonsController.updateLesson)

lessonsRouter.get('/:id', lessonsController.getLesson)
lessonsRouter.get('/:id/homeworks', lessonsController.getLessonHomeworks)

lessonsRouter.delete('/:id', lessonsController.deleteLesson)

lessonsRouter.post('/:id/homeworks', homeworkMulter, lessonsController.createHomework)
lessonsRouter.put('/:id/homeworks', homeworkMulter, lessonsController.updateHomework)


// УРОК ПРОХОДИТСЯ АВТОМАТОМ, ЕСЛИ НЕТ ЗАДАНИЯ
// lessonsRouter.put('/:id/complete', lessonsController.completeLesson)



module.exports = lessonsRouter;