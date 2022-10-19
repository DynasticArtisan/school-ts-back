const express = require('express');

const authController = require('../controllers/authController');
const { validateRegistrationData, validateResetPassword } = require('../validator');

const authRouter = express.Router();

authRouter.get('/refresh', authController.refresh);
authRouter.post('/registration', validateRegistrationData, authController.registration);
authRouter.post('/login', authController.login);
authRouter.get('/activate/:link', authController.activate);
authRouter.post('/logout', authController.logout);



authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.get('/reset-password/:id/:token', authController.getResetToken);
authRouter.post('/reset-password', validateResetPassword, authController.resetPassword);
module.exports = authRouter;