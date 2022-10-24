import express from "express";
import studentsController from "../controllers/students.controller";
import CreateAccessMiddleware from "../middlewares/createAccessMiddleware";
import { UserRole } from "../models/user.model";

const studentsRouter = express.Router();

studentsRouter.post(
  "/",
  CreateAccessMiddleware([UserRole.super]),
  studentsController.createCourseProgress
);
studentsRouter.put(
  "/:student",
  CreateAccessMiddleware([UserRole.super]),
  studentsController.updateProgressAccess
);
studentsRouter.get(
  "/:student",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher])
),
  studentsController.getStudent;
export default studentsRouter;
