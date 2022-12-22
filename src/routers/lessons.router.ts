import express from "express";
import RoleMiddleware from "../middlewares/role.middleware";
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
  RoleMiddleware([UserRole.super]),
  Validate(CreateLessonSchema),
  LessonsController.createLesson
);

LessonsRouter.put(
  "/:lessonId",
  RoleMiddleware([UserRole.super]),
  Validate(UpdateLessonSchema),
  LessonsController.updateLesson
);

LessonsRouter.delete(
  "/:lessonId",
  RoleMiddleware([UserRole.super]),
  Validate(GetLessonSchema),
  LessonsController.deleteLesson
);

LessonsRouter.get(
  "/:lessonId",
  RoleMiddleware([
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
  RoleMiddleware([UserRole.user]),
  LessonsController.completeLesson
);

LessonsRouter.post(
  "/:lessonId/homework",
  Validate(GetLessonSchema),
  RoleMiddleware([UserRole.user]),
  HomeworkUploads,
  LessonsController.createHomework,
  HomeworkUploadsCancel
);

LessonsRouter.put(
  "/:lessonId/homework",
  Validate(GetLessonSchema),
  RoleMiddleware([UserRole.user]),
  HomeworkUploads,
  LessonsController.updateHomework,
  HomeworkUploadsCancel
);

export default LessonsRouter;
