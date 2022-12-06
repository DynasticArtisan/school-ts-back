import express from "express";
import CreateAccessMiddleware from "../middlewares/createAccessMiddleware";
import { UserRole } from "../models/user.model";
import {
  HomeworkUploads,
  HomeworkUploadsCancel,
} from "../middlewares/homework.midleware";
import Validate from "../middlewares/validate.middleware";
import {
  CreateLessonSchema,
  GetLessonSchema,
  UpdateLessonSchema,
} from "../schemas/lesson.schema";
import LessonsController from "../controllers/lessons.controller";

const LessonsRouter = express.Router();

LessonsRouter.post(
  "/",
  CreateAccessMiddleware([UserRole.super]),
  Validate(CreateLessonSchema),
  LessonsController.createLesson
);

LessonsRouter.put(
  "/:lesson",
  CreateAccessMiddleware([UserRole.super]),
  Validate(UpdateLessonSchema),
  LessonsController.updateLesson
);

LessonsRouter.delete(
  "/:lessonId",
  CreateAccessMiddleware([UserRole.super]),
  Validate(GetLessonSchema),
  LessonsController.deleteLesson
);

LessonsRouter.get(
  "/:lessonId",
  CreateAccessMiddleware([
    UserRole.super,
    UserRole.teacher,
    UserRole.curator,
    UserRole.user,
  ]),
  Validate(GetLessonSchema),
  LessonsController.getLesson
);

LessonsRouter.post(
  "/:lessonId",
  Validate(GetLessonSchema),
  CreateAccessMiddleware([UserRole.user]),
  LessonsController.completeLesson
);

LessonsRouter.post(
  "/:lesson/homework",
  Validate(GetLessonSchema),
  CreateAccessMiddleware([UserRole.user]),
  HomeworkUploads,
  LessonsController.createHomework,
  HomeworkUploadsCancel
);

LessonsRouter.put(
  "/:lesson/homework",
  Validate(GetLessonSchema),
  CreateAccessMiddleware([UserRole.user]),
  HomeworkUploads,
  LessonsController.updateHomework,
  HomeworkUploadsCancel
);

export default LessonsRouter;
