import AuthMiddleware from "src/middlewares/authMiddleware";
import express from "express";
import authRouter from "./authRouter";
import usersRouter from "./usersRouter";
import studentsRouter from "./studentsRouter";
import mastersRouter from "./mastersRouter";
import coursesRouter from "./coursesRouter";
import modulesRouter from "./modulesRouter";
import lessonsRouter from "./lessonsRouter";
import homeworkRouter from "./homeworkRouter";
import notifRouter from "./notifRouter";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", AuthMiddleware, usersRouter);
apiRouter.use("/students", AuthMiddleware, studentsRouter);
apiRouter.use("/masters", AuthMiddleware, mastersRouter);
apiRouter.use("/courses", AuthMiddleware, coursesRouter);
apiRouter.use("/modules", AuthMiddleware, modulesRouter);
apiRouter.use("/lessons", AuthMiddleware, lessonsRouter);
apiRouter.use("/homeworks", AuthMiddleware, homeworkRouter);
apiRouter.use("/notifications", AuthMiddleware, notifRouter);

export default apiRouter;
