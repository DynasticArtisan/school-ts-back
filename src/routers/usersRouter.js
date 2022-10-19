const express = require('express');
const usersController = require('../controllers/usersController');

const usersRouter = express.Router();

usersRouter.get('/',  usersController.getUsers)
usersRouter.get('/:id', usersController.getUser)
usersRouter.get('/:id/:course', usersController.getStudent);

usersRouter.put("/me", usersController.updateProfile)
usersRouter.put("/me/password", usersController.updatePassword)
usersRouter.put("/:id/role", usersController.changeRole);

usersRouter.delete('/:id', usersController.deleteUser)

module.exports = usersRouter;