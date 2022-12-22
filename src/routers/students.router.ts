import { Router } from "express";
import StudentsController from "../controllers/students.controller";
import RoleMiddleware from "../middlewares/role.middleware";
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
  RoleMiddleware([UserRole.super]),
  Validate(CreateStudentSchema),
  StudentsController.createStudent
);

StudentsRouter.get(
  "/:studentId",
  RoleMiddleware([UserRole.super, UserRole.teacher]),
  Validate(GetStudentSchema),
  StudentsController.getStudentProfile
);

StudentsRouter.patch(
  "/:studentId",
  RoleMiddleware([UserRole.super]),
  Validate(UpdStudentAccessSchema),
  StudentsController.updateStudentAccess
);

export default StudentsRouter;
