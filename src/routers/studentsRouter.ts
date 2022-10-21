import express from "express";
import studentsController from "src/controllers/studentsController";
import CreateAccessMiddleware from "src/middlewares/createAccessMiddleware";
import { UserRole } from "src/models/userModel";

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
