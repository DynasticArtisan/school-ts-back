const express = require('express');

const authController = require('../controllers/authController');
const { validateRegistrationData, validateResetPassword } = require('../validator');

const authRouter = express.Router();
authRouter.post('/registration', validateRegistrationData, authController.registration);
authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.get('/reset-password/:id/:token', authController.getResetToken);
authRouter.post('/reset-password', validateResetPassword, authController.resetPassword);
authRouter.get('/activate/:link', authController.activate);
authRouter.get('/refresh', authController.refresh);
module.exports = authRouter;