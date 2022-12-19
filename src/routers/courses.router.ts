import express from "express";
import CoursesController from "../controllers/courses.controller";
import CreateAccessMiddleware from "../middlewares/createAccessMiddleware";
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
  CreateAccessMiddleware([
    UserRole.super,
    UserRole.teacher,
    UserRole.curator,
    UserRole.user,
  ]),
  CoursesController.getCourses
);

CoursesRouter.post(
  "/",
  CreateAccessMiddleware([UserRole.super]),
  CourseUploads,
  Validate(CreateCourseSchema),
  CoursesController.createCourse,
  CourseUploadsCancel
);

CoursesRouter.put(
  "/:courseId",
  CreateAccessMiddleware([UserRole.super]),
  CourseUploads,
  Validate(UpdateCourseSchema),
  CoursesController.updateCourse,
  CourseUploadsCancel
);

CoursesRouter.delete(
  "/:courseId",
  CreateAccessMiddleware([UserRole.super]),
  Validate(GetCourseSchema),
  CoursesController.deleteCourse
);

CoursesRouter.get(
  "/:courseId/modules",
  CreateAccessMiddleware([
    UserRole.super,
    UserRole.teacher,
    UserRole.curator,
    UserRole.user,
  ]),
  Validate(GetCourseSchema),
  CoursesController.getModules
);

CoursesRouter.post(
  "/:courseId/modules",
  CreateAccessMiddleware([UserRole.super]),
  Validate(CreateModuleSchema),
  CoursesController.createModule
);

CoursesRouter.get(
  "/:courseId/users",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher]),
  Validate(GetCourseSchema),
  CoursesController.getStudents
);
CoursesRouter.post(
  "/:courseId/students",
  CreateAccessMiddleware([UserRole.super]),
  Validate(CreateStudentSchema),
  CoursesController.createStudent
);

CoursesRouter.get(
  "/:courseId/users/:userId",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher]),
  Validate(GetStudentSchema),
  CoursesController.getStudentProfile
);
CoursesRouter.put(
  "/:courseId/users/:userId",
  CreateAccessMiddleware([UserRole.super]),
  Validate(UpdateAccessSchema),
  CoursesController.updateStudentAccess
);

CoursesRouter.post(
  "/:courseId/masters",
  CreateAccessMiddleware([UserRole.super]),
  Validate(CreateTeacherSchema),
  CoursesController.createMaster
);
CoursesRouter.put(
  "/:courseId/masters/:userId",
  CreateAccessMiddleware([UserRole.super]),
  Validate(UpdateAccessSchema),
  CoursesController.updateStudentAccess
);
export default CoursesRouter;
