import express from "express";
import RoleMiddleware from "../middlewares/role.middleware";
import { UserRole } from "../models/user.model";
import Validate from "../middlewares/validate.middleware";
import {
  GetUserSchema,
  SwitchRoleSchema,
  UpdatePasswordSchema,
  UpdateProfileSchema,
} from "../schemas/user.schema";
import UsersController from "../controllers/users.controller";

const UsersRouter = express.Router();

UsersRouter.get(
  "/",
  RoleMiddleware([UserRole.super, UserRole.admin]),
  UsersController.getUsers
);

UsersRouter.get(
  "/:userId/profile",
  RoleMiddleware([UserRole.super, UserRole.admin]),
  Validate(GetUserSchema),
  UsersController.getUserProfile
);

UsersRouter.put(
  "/:userId/role",
  RoleMiddleware([UserRole.super]),
  Validate(SwitchRoleSchema),
  UsersController.setUserRole
);

UsersRouter.delete(
  "/:userId",
  RoleMiddleware([UserRole.super]),
  Validate(GetUserSchema),
  UsersController.deleteUser
);

UsersRouter.put(
  "/me",
  Validate(UpdateProfileSchema),
  UsersController.updateProfile
);

UsersRouter.put(
  "/me/password",
  Validate(UpdatePasswordSchema),
  UsersController.updatePassword
);

export default UsersRouter;
