const express = require('express');
const progressController = require('../controllers/progressController');

const progressRouter = express.Router();
 
progressRouter.get('/lesson', progressController.getAllULProgress)
progressRouter.post('/lesson', progressController.createULProgress)
progressRouter.delete('/lesson', progressController.deleteULProgress)

progressRouter.get('/module', progressController.getAllUMProgress)
progressRouter.post('/module', progressController.createUMProgress)
progressRouter.delete('/module', progressController.deleteUMProgress)

progressRouter.get('/course', progressController.getAllUCProgress)
progressRouter.post('/course', progressController.createUCProgress)
progressRouter.delete('/course', progressController.deleteUCProgress)

progressRouter.post('/', progressController.createUserProgress)
progressRouter.post('/drop', progressController.dropDB)

module.exports = progressRouter;