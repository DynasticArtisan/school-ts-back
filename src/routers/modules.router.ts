import express from "express";
import modulesController from "../controllers/modules.controller";
import CreateAccessMiddleware from "../middlewares/createAccessMiddleware";
import { UserRole } from "../models/user.model";

const modulesRouter = express.Router();
modulesRouter.post(
  "/",
  CreateAccessMiddleware([UserRole.super]),
  modulesController.createModule
);
modulesRouter.put(
  "/:module",
  CreateAccessMiddleware([UserRole.super]),
  modulesController.updateModule
);
modulesRouter.delete(
  "/:module",
  CreateAccessMiddleware([UserRole.super]),
  modulesController.deleteModule
);

modulesRouter.post("/:module/lessons", modulesController.createLesson);

modulesRouter.get("/:module/lessons", modulesController.getLessons);

export default modulesRouter;
