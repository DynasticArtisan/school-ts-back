const express = require('express');
const lessonsController = require('../controllers/lessonsController');

const lessonsRouter = express.Router();
lessonsRouter.post('/',  lessonsController.createLesson)
lessonsRouter.get('/:id', lessonsController.getLesson)
lessonsRouter.put('/:id', lessonsController.updateLesson)
// Для прохождения урока
lessonsRouter.put('/:id/complete', lessonsController.completeLesson)

lessonsRouter.delete('/:id', lessonsController.deleteLesson)

// Для очистки базы данных
//lessonsRouter.delete('/', lessonsController.dropAllLessons)



module.exports = lessonsRouter;