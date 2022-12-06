import express from "express";
import CreateAccessMiddleware from "../middlewares/createAccessMiddleware";
import { UserRole } from "../models/user.model";
import Validate from "../middlewares/validate.middleware";
import { GetCourseSchema } from "../schemas/course.schema";
import { GetLessonSchema } from "../schemas/lesson.schema";
import { GetHomeworkSchema } from "../schemas/homework.schema";
import HomeworkController from "../controllers/homework.controller";

const HomeworkRouter = express.Router();

HomeworkRouter.get(
  "/courses",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher, UserRole.curator]),
  HomeworkController.getCourses
);

HomeworkRouter.get(
  "/courses/:courseId",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher, UserRole.curator]),
  Validate(GetCourseSchema),
  HomeworkController.getCourseLessons
);

HomeworkRouter.get(
  "/lessons/:lessonId",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher, UserRole.curator]),
  Validate(GetLessonSchema),
  HomeworkController.getLessonHomeworks
);

HomeworkRouter.get(
  "/:homeworkId",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher, UserRole.curator]),
  Validate(GetHomeworkSchema),
  HomeworkController.getHomework
);

HomeworkRouter.put(
  "/:homework/accept",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher, UserRole.curator]),
  Validate(GetHomeworkSchema),
  HomeworkController.acceptHomework
);

HomeworkRouter.put(
  "/:homework/reject",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher, UserRole.curator]),
  Validate(GetHomeworkSchema),
  HomeworkController.rejectHomework
);

export default HomeworkRouter;
