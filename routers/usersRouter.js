const express = require('express');
const { body } = require('express-validator');

const usersController = require('../controllers/usersController');
const fileMiddleware = require('../middlewares/fileMiddleware');

const usersRouter = express.Router();
usersRouter.post("/password", body('newPassword').isLength({ min: 6, max: 32 }), usersController.changePassword)
usersRouter.post("/changerole", usersController.changeUserRole); 
usersRouter.get("/", usersController.getUsers );
usersRouter.get("/:id", usersController.getOneUser );
usersRouter.post("/settings/notifications", usersController.updateNotoficationSettings)
usersRouter.post("/update", usersController.updateUserInfo);
usersRouter.post("/avatar", fileMiddleware.single('avatar'), usersController.uploadUserAvatar)
usersRouter.delete("/avatar", usersController.removeUserAvatar)
   
module.exports = usersRouter;