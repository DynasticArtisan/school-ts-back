const express = require('express');
const notificationsController = require('../controllers/notificationsController');
const authMiddleware = require('../middlewares/authMiddleware');

const notificationRouter = express.Router();
notificationRouter.post('/:userId', notificationsController.createUserNotification)

module.exports = notificationRouter;