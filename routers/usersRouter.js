const express = require('express');
const usersController = require('../controllers/usersController');

const usersRouter = express.Router();

usersRouter.post('/', usersController.createUser)
usersRouter.get('/', usersController.getAllUsers)
usersRouter.get('/:userId', usersController.getOneUser)
usersRouter.put('/:userId', usersController.updateUser)
usersRouter.delete('/:userId', usersController.deleteUser)

usersRouter.put("/:userId/role", usersController.updateUserRole);


   
module.exports = usersRouter;