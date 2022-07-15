const express = require('express');
const lessonsController = require('../controllers/lessonsController');
const authMiddleware = require('../middlewares/authMiddleware');

const lessonsRouter = express.Router();
lessonsRouter.post('/',  lessonsController.createLesson)
lessonsRouter.get('/:id', authMiddleware, lessonsController.getLessonContent)
//lessonsRouter.post('/:id/complete',progressController.completeLesson) complete course by user

lessonsRouter.get('/', lessonsController.getAllLesson)
//lessonsRouter.get('/:id', lessonsController.getOneLesson)
lessonsRouter.put('/:id', lessonsController.updateLesson)
lessonsRouter.delete('/:id', lessonsController.deleteLesson)
lessonsRouter.delete('/', lessonsController.dropAllLessons)

//lessonRouter.get('/videos/:video', lessonController.getVideo)
module.exports = lessonsRouter;