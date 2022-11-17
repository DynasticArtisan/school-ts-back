import express from "express";
import coursesController from "../controllers/courses.controller";
import CreateAccessMiddleware from "../middlewares/createAccessMiddleware";
import Validate from "../middlewares/validate.middleware";
import { UserRole } from "../models/user.model";
import courseMulter from "../multer/courseMulter";
import {
  CreateCourseSchema,
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
coursesRouter.get(
  "/:course/modules",
  CreateAccessMiddleware([
    UserRole.super,
    UserRole.teacher,
    UserRole.curator,
    UserRole.user,
  ]),
  coursesController.getModules
);

coursesRouter.post(
  "/",
  CreateAccessMiddleware([UserRole.super]),
  //courseMulter,
  Validate(CreateCourseSchema),
  coursesController.createCourse
);

coursesRouter.put(
  "/:course",
  CreateAccessMiddleware([UserRole.super]),
  courseMulter,
  Validate(UpdateCourseSchema),
  coursesController.updateCourse
);
coursesRouter.delete(
  "/:course",
  CreateAccessMiddleware([UserRole.super]),
  coursesController.deleteCourse
);

coursesRouter.post(
  "/:course/users/",
  CreateAccessMiddleware([UserRole.super]),
  coursesController.createStudent
);
coursesRouter.get(
  "/:course/users",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher]),
  coursesController.getStudents
);
coursesRouter.get(
  "/:course/users/:user",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher]),
  coursesController.getStudentProfile
);
coursesRouter.put(
  "/:course/users/:user",
  CreateAccessMiddleware([UserRole.super]),
  coursesController.updateStudentAccess
);

coursesRouter.post(
  "/:course/masters/",
  CreateAccessMiddleware([UserRole.super]),
  coursesController.createMaster
);
coursesRouter.put(
  "/:course/masters/:user",
  CreateAccessMiddleware([UserRole.super]),
  coursesController.updateStudentAccess
);
export default coursesRouter;
