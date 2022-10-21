import express from "express";
import lessonsController from "src/controllers/lessonsController";
import CreateAccessMiddleware from "src/middlewares/createAccessMiddleware";
import { UserRole } from "src/models/userModel";

const homeworkMulter = require("../multer/homeworkMulter");

const lessonsRouter = express.Router();
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
lessonsRouter.post(
  "/:lesson/homework",
  CreateAccessMiddleware([UserRole.user]),
  homeworkMulter,
  lessonsController.createHomework
);
lessonsRouter.put(
  "/:lesson/homework",
  CreateAccessMiddleware([UserRole.user]),
  homeworkMulter,
  lessonsController.updateHomework
);

export default lessonsRouter;
