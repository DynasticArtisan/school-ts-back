import express from "express";
import coursesController from "src/controllers/coursesController";
import CourseAccessMiddleware from "src/middlewares/courseAccessMiddleware";
import OnlySuperMiddleware from "src/middlewares/onlySuperMiddleware";
import courseMulter from "src/multer/courseMulter";

const coursesRouter = express.Router();

coursesRouter.post(
  "/",
  OnlySuperMiddleware,
  courseMulter,
  coursesController.createCourse
);
coursesRouter.put(
  "/:course",
  OnlySuperMiddleware,
  courseMulter,
  coursesController.updateCourse
);
coursesRouter.delete(
  "/:course",
  OnlySuperMiddleware,
  coursesController.deleteCourse
);

coursesRouter.post(
  "/:course/progress",
  OnlySuperMiddleware,
  coursesController.createCourseProgress
);
coursesRouter.put(
  "/:course/progress/:progress/access",
  OnlySuperMiddleware,
  coursesController.updateProgressAccess
);

coursesRouter.post(
  "/:course/master",
  OnlySuperMiddleware,
  coursesController.createCourseMaster
);
coursesRouter.put(
  "/:course/master/:master/access",
  OnlySuperMiddleware,
  coursesController.updateMasterAccess
);

coursesRouter.get(
  "/:course/students",

  coursesController.getCourseStudents
);
coursesRouter.get(
  "/:course/exercises",

  coursesController.getCourseExercises
);

coursesRouter.get(
  "/:course/modules",

  coursesController.getCourseModules
);

coursesRouter.get("/progress", coursesController.getProgressCourses);
coursesRouter.get("/homework", coursesController.getHomeworkCourses);

export default coursesRouter;
