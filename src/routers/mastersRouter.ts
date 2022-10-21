import express from "express";
import masterController from "src/controllers/masterController";
import CreateAccessMiddleware from "src/middlewares/createAccessMiddleware";
import { UserRole } from "src/models/userModel";

const mastersRouter = express.Router();

mastersRouter.post(
  "/",
  CreateAccessMiddleware([UserRole.super]),
  masterController.createCourseMaster
);
mastersRouter.put(
  "/:master",
  CreateAccessMiddleware([UserRole.super]),
  masterController.updateCourseMasterAccess
);

export default mastersRouter;
