import express from "express";
import authRouter from "./auth.router";
import usersRouter from "./users.router";
import studentsRouter from "./students.router";
import mastersRouter from "./masters.router";
import coursesRouter from "./courses.router";
import modulesRouter from "./modules.router";
import lessonsRouter from "./lessons.router";
import homeworkRouter from "./homework.router";
import notifRouter from "./notification.router";
import AuthMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", AuthMiddleware, usersRouter);
router.use("/students", AuthMiddleware, studentsRouter);
router.use("/masters", AuthMiddleware, mastersRouter);
router.use("/courses", AuthMiddleware, coursesRouter);
router.use("/modules", AuthMiddleware, modulesRouter);
router.use("/lessons", AuthMiddleware, lessonsRouter);
router.use("/homeworks", AuthMiddleware, homeworkRouter);
router.use("/notifications", AuthMiddleware, notifRouter);

export default router;
