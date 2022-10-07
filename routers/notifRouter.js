const express = require('express');
const notifController = require('../controllers/notifController');
const authMiddleware = require('../middlewares/authMiddleware');
const notifRouter = express.Router();

notifRouter.post('/', notifController.createCustomNotif)
notifRouter.post('/many', notifController.createManyCustomNotifs)
notifRouter.get('/', notifController.getAllNotifs)
notifRouter.get('/new', authMiddleware, notifController.checkUserNotifs)
notifRouter.get('/me', authMiddleware, notifController.getUserNotifs)
notifRouter.delete('/:id', notifController.deleteNotif)

notifRouter.post('/template/', notifController.createTemplate)
notifRouter.get('/template/', notifController.getAllTemplates)
notifRouter.put('/template/:id', notifController.updateTemplate)
notifRouter.delete('/template/:id', notifController.deleteTemplate)


notifRouter.post('/hw-wait', notifController.createHWWaitNotif)
notifRouter.post('/course-lock', notifController.createCourseLockNotif)
notifRouter.post('/course-unlock', notifController.createCourseUnlockNotif)


module.exports = notifRouter;