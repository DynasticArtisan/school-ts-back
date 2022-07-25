const express = require('express');
const usersController = require('../controllers/usersController');

const usersRouter = express.Router();

usersRouter.get('/',  usersController.getUsers)
usersRouter.get('/:id', usersController.getUser)
usersRouter.get('/:id/student', usersController.getStudent);
usersRouter.put("/:id/role", usersController.changeRole);
usersRouter.put("/me", usersController.updateProfile)
usersRouter.put("/me/password", usersController.updatePassword)

usersRouter.delete('/:id', usersController.deleteUser)

module.exports = usersRouter;