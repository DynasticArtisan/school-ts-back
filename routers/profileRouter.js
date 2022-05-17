const express = require('express');
const profileController = require('../controllers/profileController');
const fileMiddleware = require('../middlewares/fileMiddleware');

const profileRouter = express.Router();
profileRouter.get('/', profileController.getProfile)
profileRouter.post('/', profileController.updateProfile) //validate that
profileRouter.post('/avatar', fileMiddleware.single('avatar'), profileController.uploadAvatar)
profileRouter.delete('/avatar', profileController.removeAvatar)
profileRouter.post('/password', profileController.changePassword) //validate that
profileRouter.get('/notifications', profileController.getNotifications)
profileRouter.post('/notifications', profileController.updateNotificationsSettings) //validate that
profileRouter.get('/notifications/check', profileController.checkNewNotifications)
profileRouter.get('/courses/:userId', profileController.getMyCourses)

module.exports = profileRouter;