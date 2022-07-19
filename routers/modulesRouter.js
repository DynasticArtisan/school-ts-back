const express = require('express');
const modulesController = require('../controllers/modulesController');

const modulesRouter = express.Router();
modulesRouter.post('/', modulesController.createModule)
modulesRouter.get('/:id', modulesController.getModule)
modulesRouter.put('/:id', modulesController.updateModule)
modulesRouter.delete('/:id', modulesController.deleteModule)

// Для очистки базы данных
//modulesRouter.delete('/', modulesController.dropAllModules)

module.exports = modulesRouter;