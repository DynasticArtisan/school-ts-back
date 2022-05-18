const express = require('express');
const progressController = require('../controllers/progressController');

const progressRouter = express.Router();
 
progressRouter.post('/lesson', progressController.createULProgress)
progressRouter.get('/lesson', progressController.getAllULProgress)
progressRouter.get('/lesson/:progressID', progressController.getOneULProgress)
progressRouter.put('/lesson/:progressID', progressController.updateULProgress)
progressRouter.delete('/lesson/:progressID', progressController.deleteULProgress)
progressRouter.delete('/lesson', progressController.deleteAllULProgress)

progressRouter.post('/module', progressController.createUMProgress)
progressRouter.get('/module', progressController.getAllUMProgress)
progressRouter.get('/module/:progressID', progressController.getOneUMProgress)
progressRouter.put('/module/:progressID', progressController.updateUMProgress)
progressRouter.delete('/module/:progressID', progressController.deleteUMProgress)
progressRouter.delete('/module', progressController.deleteAllUMProgress)

progressRouter.post('/course', progressController.createUCProgress)
progressRouter.get('/course', progressController.getAllUCProgress)
progressRouter.get('/course/:progressID', progressController.getOneUCProgress)
progressRouter.put('/course/:progressID', progressController.updateUCProgress)
progressRouter.delete('/course/:progressID', progressController.deleteUCProgress)
progressRouter.delete('/course', progressController.deleteAllUCProgress)

progressRouter.post('/', progressController.unlockCourseToUser)
// for complete lesson -> homework api
progressRouter.post('/complete', progressController.completeLesson)

module.exports = progressRouter;