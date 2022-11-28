import express from "express";
import usersController from "../controllers/users.controller";
import CreateAccessMiddleware from "../middlewares/createAccessMiddleware";
import Validate from "../middlewares/validate.middleware";
import { UserRole } from "../models/user.model";
import { SwitchRoleSchema, UpdatePasswordSchema } from "../schemas/user.schema";

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
  "/:userId/role",
  CreateAccessMiddleware([UserRole.super]),
  Validate(SwitchRoleSchema),
  usersController.setUserRole
);
usersRouter.delete(
  "/:user",
  CreateAccessMiddleware([UserRole.super]),
  usersController.deleteUser
);

usersRouter.put("/me", usersController.updateProfile);
usersRouter.put(
  "/me/password",
  Validate(UpdatePasswordSchema),
  usersController.updatePassword
);

export default usersRouter;
