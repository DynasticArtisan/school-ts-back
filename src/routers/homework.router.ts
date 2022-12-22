import express from "express";
import RoleMiddleware from "../middlewares/role.middleware";
import { UserRole } from "../models/user.model";
import Validate from "../middlewares/validate.middleware";
import { GetCourseSchema } from "../schemas/course.schema";
import { GetLessonSchema } from "../schemas/lesson.schema";
import {
  GetHomeworkSchema,
  VerifyHomeworkSchema,
} from "../schemas/homework.schema";
import HomeworkController from "../controllers/homework.controller";

const HomeworkRouter = express.Router();

HomeworkRouter.get(
  "/courses",
  RoleMiddleware([UserRole.super, UserRole.teacher, UserRole.curator]),
  HomeworkController.getCourses
);

HomeworkRouter.get(
  "/courses/:courseId",
  RoleMiddleware([UserRole.super, UserRole.teacher, UserRole.curator]),
  Validate(GetCourseSchema),
  HomeworkController.getCourseLessons
);

HomeworkRouter.get(
  "/lessons/:lessonId",
  RoleMiddleware([UserRole.super, UserRole.teacher, UserRole.curator]),
  Validate(GetLessonSchema),
  HomeworkController.getLessonHomeworks
);

HomeworkRouter.get(
  "/:homeworkId",
  RoleMiddleware([UserRole.super, UserRole.teacher, UserRole.curator]),
  Validate(GetHomeworkSchema),
  HomeworkController.getHomework
);

HomeworkRouter.put(
  "/:homeworkId/accept",
  RoleMiddleware([UserRole.super, UserRole.teacher, UserRole.curator]),
  Validate(VerifyHomeworkSchema),
  HomeworkController.acceptHomework
);

HomeworkRouter.put(
  "/:homeworkId/reject",
  RoleMiddleware([UserRole.super, UserRole.teacher, UserRole.curator]),
  Validate(VerifyHomeworkSchema),
  HomeworkController.rejectHomework
);

export default HomeworkRouter;
