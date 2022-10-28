import express from "express";
import coursesController from "../controllers/courses.controller";
import CreateAccessMiddleware from "../middlewares/createAccessMiddleware";
import { UserRole } from "../models/user.model";
import courseMulter from "../multer/courseMulter";

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
coursesRouter.get(
  "/:course/students",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher]),
  coursesController.getStudents
);

coursesRouter.post(
  "/",
  CreateAccessMiddleware([UserRole.super]),
  courseMulter,
  coursesController.createCourse
);
coursesRouter.put(
  "/:course",
  CreateAccessMiddleware([UserRole.super]),
  courseMulter,
  coursesController.updateCourse
);
coursesRouter.delete(
  "/:course",
  CreateAccessMiddleware([UserRole.super]),
  coursesController.deleteCourse
);

export default coursesRouter;
