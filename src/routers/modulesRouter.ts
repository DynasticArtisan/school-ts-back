import express from "express";
import modulesController from "src/controllers/modulesController";
import CreateAccessMiddleware from "src/middlewares/createAccessMiddleware";
import { UserRole } from "src/models/userModel";

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

modulesRouter.get("/:module/lessons", modulesController.getModuleLessons);

export default modulesRouter;
