import express from "express";
import usersController from "../controllers/users.controller";
import CreateAccessMiddleware from "../middlewares/createAccessMiddleware";
import { UserRole } from "../models/user.model";

const usersRouter = express.Router();

usersRouter.get(
  "/",
  CreateAccessMiddleware([UserRole.super, UserRole.admin]),
  usersController.getUsers
);
usersRouter.get(
  "/:user/profile",
  CreateAccessMiddleware([UserRole.super, UserRole.admin]),
  usersController.getUserProfile
);
usersRouter.put(
  "/:user/role",
  CreateAccessMiddleware([UserRole.super]),
  usersController.setUserRole
);
usersRouter.delete(
  "/:user",
  CreateAccessMiddleware([UserRole.super]),
  usersController.deleteUser
);

usersRouter.put("/me", usersController.updateProfile);
usersRouter.put("/me/password", usersController.updatePassword);

export default usersRouter;
