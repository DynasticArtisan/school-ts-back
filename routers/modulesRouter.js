const express = require('express');
const modulesController = require('../controllers/modulesController');

const modulesRouter = express.Router();
modulesRouter.post('/', modulesController.createModule)
modulesRouter.put('/:id', modulesController.updateModule)
modulesRouter.get('/:id', modulesController.getModule)
modulesRouter.delete('/:id', modulesController.deleteModule)

module.exports = modulesRouter;