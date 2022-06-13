const express = require('express');
const modulesController = require('../controllers/modulesController');
const modulesRouter = express.Router();

modulesRouter.get('/:id/lessons', modulesController.getOneModuleLessons)

modulesRouter.post('/', modulesController.createModule)
modulesRouter.get('/', modulesController.getModules)
modulesRouter.get('/:id', modulesController.getOneModule)
modulesRouter.put('/:id', modulesController.updateModule)
modulesRouter.delete('/:id', modulesController.deleteModule)
modulesRouter.delete('/', modulesController.dropAllModules)

module.exports = modulesRouter;