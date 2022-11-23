import express from "express";
import homeworkController from "../controllers/homework.controller";
import CreateAccessMiddleware from "../middlewares/createAccessMiddleware";
import { UserRole } from "../models/user.model";

const homeworkRouter = express.Router();

homeworkRouter.get(
  "/courses",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher, UserRole.curator]),
  homeworkController.getCourses
);
homeworkRouter.get(
  "/courses/:course",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher, UserRole.curator]),
  homeworkController.getCourseLessons
);
homeworkRouter.get(
  "/lessons/:lesson",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher, UserRole.curator]),
  homeworkController.getLessonHomeworks
);

homeworkRouter.get(
  "/:homework",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher, UserRole.curator]),
  homeworkController.getHomework
);
homeworkRouter.put(
  "/:homework/accept",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher, UserRole.curator]),
  homeworkController.acceptHomework
);
homeworkRouter.put(
  "/:homework/reject",
  CreateAccessMiddleware([UserRole.super, UserRole.teacher, UserRole.curator]),
  homeworkController.rejectHomework
);

export default homeworkRouter;