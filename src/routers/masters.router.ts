import express from "express";
import masterController from "../controllers/master.controller";
import CreateAccessMiddleware from "../middlewares/createAccessMiddleware";
import { UserRole } from "../models/user.model";

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
