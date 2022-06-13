const express = require('express');
const profileController = require('../controllers/profileController');
const avatarMulter = require('../multer/avatarMulter');

const profileRouter = express.Router();
profileRouter.get('/', profileController.getProfile)
profileRouter.post('/', profileController.updateProfile) //validate that

profileRouter.post('/avatar', avatarMulter, profileController.uploadAvatar)
profileRouter.delete('/avatar', profileController.removeAvatar)

profileRouter.post('/password', profileController.changePassword) //validate that

profileRouter.get('/notifications', profileController.getNotifications)
profileRouter.post('/notifications', profileController.updateNotificationsSettings) //validate that
profileRouter.get('/notifications/check', profileController.checkNewNotifications)


module.exports = profileRouter;