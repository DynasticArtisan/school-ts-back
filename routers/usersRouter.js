const express = require('express');
const usersController = require('../controllers/usersController');

const usersRouter = express.Router();
 
// maybe into super-router
usersRouter.post("/changerole", usersController.changeUserRole);
usersRouter.get("/", usersController.getUsers );
usersRouter.get("/:id", usersController.getOneUser );

   
module.exports = usersRouter;