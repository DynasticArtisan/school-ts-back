const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/authController');

const authRouter = express.Router();
authRouter.post('/registration', body('name').isLength({ min: 2 }), 
    body('surname').isLength({ min: 2 }), 
    body('email').isEmail(), 
    body('password').isLength({min: 3, max: 32}), 
    authController.registration);
authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.get('/reset-password/:id/:token', authController.getResetToken);
authRouter.post('/reset-password', body('newPassword').isLength({min: 6, max: 32}), authController.resetPassword);
authRouter.get('/activate/:link', authController.activate);
authRouter.get('/refresh', authController.refresh);
module.exports = authRouter;