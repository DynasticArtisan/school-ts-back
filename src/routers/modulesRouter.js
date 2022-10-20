const express = require('express');
const { default: OnlySuperMiddleware } = require('src/middlewares/onlySuperMiddleware');
const modulesController = require('../controllers/modulesController');

const modulesRouter = express.Router();
modulesRouter.post('/', OnlySuperMiddleware,  modulesController.createModule)
modulesRouter.put('/:id', OnlySuperMiddleware,  modulesController.updateModule)
modulesRouter.get('/:id', modulesController.getModule)
modulesRouter.delete('/:id', OnlySuperMiddleware,  modulesController.deleteModule)

module.exports = modulesRouter;