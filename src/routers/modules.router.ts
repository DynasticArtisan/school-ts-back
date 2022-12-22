import express from "express";
import RoleMiddleware from "../middlewares/role.middleware";
import { UserRole } from "../models/user.model";
import Validate from "../middlewares/validate.middleware";
import {
  CreateLessonSchema,
  CreateModuleSchema,
  GetModuleSchema,
  UpdateModuleSchema,
} from "../schemas/module.schema";
import ModulesController from "../controllers/modules.controller";

const ModulesRouter = express.Router();

ModulesRouter.post(
  "/",
  RoleMiddleware([UserRole.super]),
  Validate(CreateModuleSchema),
  ModulesController.createModule
);

ModulesRouter.put(
  "/:moduleId",
  RoleMiddleware([UserRole.super]),
  Validate(UpdateModuleSchema),
  ModulesController.updateModule
);

ModulesRouter.get(
  "/:moduleId/lessons",
  RoleMiddleware([
    UserRole.user,
    UserRole.curator,
    UserRole.teacher,
    UserRole.super,
  ]),
  Validate(GetModuleSchema),
  ModulesController.getLessons
);

ModulesRouter.delete(
  "/:moduleId",
  RoleMiddleware([UserRole.super]),
  Validate(GetModuleSchema),
  ModulesController.deleteModule
);

ModulesRouter.post(
  "/:moduleId/lessons",
  RoleMiddleware([UserRole.super]),
  Validate(CreateLessonSchema),
  ModulesController.createLesson
);

export default ModulesRouter;
