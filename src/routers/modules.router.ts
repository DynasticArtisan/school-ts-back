import express from "express";
import CreateAccessMiddleware from "../middlewares/createAccessMiddleware";
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
  CreateAccessMiddleware([UserRole.super]),
  Validate(CreateModuleSchema),
  ModulesController.createModule
);

ModulesRouter.put(
  "/:moduleId",
  CreateAccessMiddleware([UserRole.super]),
  Validate(UpdateModuleSchema),
  ModulesController.updateModule
);

ModulesRouter.get(
  "/:moduleId/lessons",
  CreateAccessMiddleware([
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
  CreateAccessMiddleware([UserRole.super]),
  Validate(GetModuleSchema),
  ModulesController.deleteModule
);

ModulesRouter.post(
  "/:moduleId/lessons",
  CreateAccessMiddleware([UserRole.super]),
  Validate(CreateLessonSchema),
  ModulesController.createLesson
);

export default ModulesRouter;
