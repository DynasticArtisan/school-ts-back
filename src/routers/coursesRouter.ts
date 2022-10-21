import express from "express";
import coursesController from "src/controllers/coursesController";
import CreateAccessMiddleware from "src/middlewares/createAccessMiddleware";
import courseMulter from "src/multer/courseMulter";
import { UserRole } from "src/models/userModel";

const coursesRouter = express.Router();

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

coursesRouter.get(
  "/",
  CreateAccessMiddleware([
    UserRole.super,
    UserRole.teacher,
    UserRole.curator,
    UserRole.user,
  ]),
  coursesController.getProgressCourses
);
coursesRouter.get(
  "/:course/modules",
  CreateAccessMiddleware([
    UserRole.super,
    UserRole.teacher,
    UserRole.curator,
    UserRole.user,
  ]),
  coursesController.getCourseModules
);
coursesRouter.get(
  "/:course/students",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher]),
  coursesController.getCourseStudents
);

coursesRouter.get("/:course/exercises", coursesController.getCourseExercises);

coursesRouter.get("/homework", coursesController.getHomeworkCourses);

export default coursesRouter;
