import express from "express";
import lessonsController from "../controllers/lessons.controller";
import CreateAccessMiddleware from "../middlewares/createAccessMiddleware";
import { UserRole } from "../models/user.model";
import {
  HomeworkUploads,
  HomeworkUploadsCancel,
} from "../middlewares/homework.midleware";

const lessonsRouter = express.Router();
// SUPER ROUTES
lessonsRouter.post(
  "/",
  CreateAccessMiddleware([UserRole.super]),
  lessonsController.createLesson
);
lessonsRouter.put(
  "/:lesson",
  CreateAccessMiddleware([UserRole.super]),
  lessonsController.updateLesson
);
lessonsRouter.delete(
  "/:lesson",
  CreateAccessMiddleware([UserRole.super]),
  lessonsController.deleteLesson
);
// USER ROUTES
lessonsRouter.post(
  "/:lesson",
  CreateAccessMiddleware([UserRole.user]),
  lessonsController.completeLesson
);
lessonsRouter.post(
  "/:lesson/homework",
  CreateAccessMiddleware([UserRole.user]),
  HomeworkUploads,
  lessonsController.createHomework,
  HomeworkUploadsCancel
);
lessonsRouter.put(
  "/:lesson/homework",
  CreateAccessMiddleware([UserRole.user]),
  HomeworkUploads,
  lessonsController.updateHomework,
  HomeworkUploadsCancel
);
// COMMON ROUTES
lessonsRouter.get(
  "/:lesson",
  CreateAccessMiddleware([
    UserRole.super,
    UserRole.teacher,
    UserRole.curator,
    UserRole.user,
  ]),
  lessonsController.getLesson
);

export default lessonsRouter;
