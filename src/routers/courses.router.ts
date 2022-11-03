import express from "express";
import coursesController from "../controllers/courses.controller";
import CreateAccessMiddleware from "../middlewares/createAccessMiddleware";
import Validate from "../middlewares/validate.middleware";
import { UserRole } from "../models/user.model";
import courseMulter from "../multer/courseMulter";
import {
  CreateCourseSchema,
  CreateStudentSchema,
  CreateTeacherSchema,
  GetCourseSchema,
  GetStudentSchema,
  UpdateAccessSchema,
  UpdateCourseSchema,
} from "../schemas/course.schema";

const coursesRouter = express.Router();
coursesRouter.get(
  "/",
  CreateAccessMiddleware([
    UserRole.super,
    UserRole.teacher,
    UserRole.curator,
    UserRole.user,
  ]),
  coursesController.getCourses
);
coursesRouter.post(
  "/",
  CreateAccessMiddleware([UserRole.super]),
  Validate(CreateCourseSchema),
  courseMulter,
  coursesController.createCourse
);
coursesRouter.put(
  "/:courseId",
  CreateAccessMiddleware([UserRole.super]),
  Validate(UpdateCourseSchema),
  courseMulter,
  coursesController.updateCourse
);
coursesRouter.delete(
  "/:courseId",
  CreateAccessMiddleware([UserRole.super]),
  Validate(GetCourseSchema),
  coursesController.deleteCourse
);
coursesRouter.get(
  "/:courseId/modules",
  CreateAccessMiddleware([
    UserRole.super,
    UserRole.teacher,
    UserRole.curator,
    UserRole.user,
  ]),
  Validate(GetCourseSchema),
  coursesController.getModules
);
coursesRouter.get(
  "/:courseId/users",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher]),
  Validate(GetCourseSchema),
  coursesController.getStudents
);
coursesRouter.post(
  "/:courseId/users/:userId",
  CreateAccessMiddleware([UserRole.super]),
  Validate(CreateStudentSchema),
  coursesController.createStudent
);
coursesRouter.get(
  "/:courseId/users/:userId",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher]),
  Validate(GetStudentSchema),
  coursesController.getStudentProfile
);
coursesRouter.put(
  "/:courseId/users/:userId",
  CreateAccessMiddleware([UserRole.super]),
  Validate(UpdateAccessSchema),
  coursesController.updateStudentAccess
);

coursesRouter.post(
  "/:courseId/masters/:userId",
  CreateAccessMiddleware([UserRole.super]),
  Validate(CreateTeacherSchema),
  coursesController.createMaster
);
coursesRouter.put(
  "/:courseId/masters/:userId",
  CreateAccessMiddleware([UserRole.super]),
  Validate(UpdateAccessSchema),
  coursesController.updateStudentAccess
);
export default coursesRouter;
