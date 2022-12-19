import { Router } from "express";
import StudentsController from "../controllers/students.controller";
import CreateAccessMiddleware from "../middlewares/createAccessMiddleware";
import Validate from "../middlewares/validate.middleware";
import { UserRole } from "../models/user.model";
import {
  CreateStudentSchema,
  GetStudentSchema,
  UpdStudentAccessSchema,
} from "../schemas/student.schema";

const StudentsRouter = Router();

StudentsRouter.post(
  "/",
  CreateAccessMiddleware([UserRole.super]),
  Validate(CreateStudentSchema),
  StudentsController.createStudent
);

StudentsRouter.get(
  "/:studentId",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher]),
  Validate(GetStudentSchema),
  StudentsController.getStudentProfile
);

StudentsRouter.patch(
  "/:studentId",
  CreateAccessMiddleware([UserRole.super]),
  Validate(UpdStudentAccessSchema),
  StudentsController.updateStudentAccess
);

export default StudentsRouter;
