import express from "express";
import coursesController from "../controllers/courses.controller";
import CreateAccessMiddleware from "../middlewares/createAccessMiddleware";
import Validate from "../middlewares/validate.middleware";
import { UserRole } from "../models/user.model";
import {
  CourseUploads,
  CourseUploadsCancel,
} from "../middlewares/course.middleware";
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
  CourseUploads,
  Validate(CreateCourseSchema),
  coursesController.createCourse,
  CourseUploadsCancel
);

coursesRouter.put(
  "/:courseId",
  CreateAccessMiddleware([UserRole.super]),
  CourseUploads,
  Validate(UpdateCourseSchema),
  coursesController.updateCourse,
  CourseUploadsCancel
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
  "/:courseId/students",
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
  "/:course/masters",
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
