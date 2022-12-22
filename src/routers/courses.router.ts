import express from "express";
import CoursesController from "../controllers/courses.controller";
import RoleMiddleware from "../middlewares/role.middleware";
import Validate from "../middlewares/validate.middleware";
import { UserRole } from "../models/user.model";
import {
  CourseUploads,
  CourseUploadsCancel,
} from "../middlewares/course.middleware";
import {
  CreateCourseSchema,
  CreateModuleSchema,
  CreateStudentSchema,
  CreateTeacherSchema,
  GetCourseSchema,
  GetStudentSchema,
  UpdateAccessSchema,
  UpdateCourseSchema,
} from "../schemas/course.schema";

const CoursesRouter = express.Router();

CoursesRouter.get(
  "/",
  RoleMiddleware([
    UserRole.super,
    UserRole.teacher,
    UserRole.curator,
    UserRole.user,
  ]),
  CoursesController.getCourses
);

CoursesRouter.post(
  "/",
  RoleMiddleware([UserRole.super]),
  CourseUploads,
  Validate(CreateCourseSchema),
  CoursesController.createCourse,
  CourseUploadsCancel
);

CoursesRouter.put(
  "/:courseId",
  RoleMiddleware([UserRole.super]),
  CourseUploads,
  Validate(UpdateCourseSchema),
  CoursesController.updateCourse,
  CourseUploadsCancel
);

CoursesRouter.delete(
  "/:courseId",
  RoleMiddleware([UserRole.super]),
  Validate(GetCourseSchema),
  CoursesController.deleteCourse
);

CoursesRouter.post(
  "/:courseId/modules",
  RoleMiddleware([UserRole.super]),
  Validate(CreateModuleSchema),
  CoursesController.createModule
);
CoursesRouter.get(
  "/:courseId/modules",
  RoleMiddleware([
    UserRole.super,
    UserRole.teacher,
    UserRole.curator,
    UserRole.user,
  ]),
  Validate(GetCourseSchema),
  CoursesController.getModules
);

CoursesRouter.post(
  "/:courseId/students",
  RoleMiddleware([UserRole.super]),
  Validate(CreateStudentSchema),
  CoursesController.createStudent
);

CoursesRouter.get(
  "/:courseId/students",
  RoleMiddleware([UserRole.super, UserRole.teacher]),
  Validate(GetCourseSchema),
  CoursesController.getStudents
);

CoursesRouter.get(
  "/:courseId/students/:userId",
  RoleMiddleware([UserRole.super, UserRole.teacher]),
  Validate(GetStudentSchema),
  CoursesController.getStudentProfile
);

CoursesRouter.put(
  "/:courseId/users/:userId",
  RoleMiddleware([UserRole.super]),
  Validate(UpdateAccessSchema),
  CoursesController.updateStudentAccess
);

CoursesRouter.post(
  "/:courseId/masters",
  RoleMiddleware([UserRole.super]),
  Validate(CreateTeacherSchema),
  CoursesController.createMaster
);

CoursesRouter.put(
  "/:courseId/masters/:userId",
  RoleMiddleware([UserRole.super]),
  Validate(UpdateAccessSchema),
  CoursesController.updateMasterAccess
);

export default CoursesRouter;
