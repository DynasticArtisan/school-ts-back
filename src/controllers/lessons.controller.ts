import { NextFunction, Request, Response } from "express";
import {
  CreateLessonType,
  GetLessonType,
  UpdateLessonType,
} from "../schemas/lesson.schema";
import courseService from "../services/course.service";
import courseDataService from "../services/courseAccess.service";
import courseProgressService from "../services/courseProgress.service";
import homeworkService from "../services/homework.service";
import ApiError from "../exceptions/ApiError";

class LessonsController {
  async createLesson(
    req: Request<{}, {}, CreateLessonType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { moduleId, title, description, content, withExercise, exercise } =
        req.body;
      const Lesson = await courseService.createLesson(
        moduleId,
        title,
        description,
        content,
        withExercise,
        exercise
      );
      res.json(Lesson);
    } catch (e) {
      next(e);
    }
  }

  async updateLesson(
    req: Request<UpdateLessonType["params"], {}, UpdateLessonType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { lessonId } = req.params;
      const { title, description, content, withExercise, exercise } = req.body;
      const Lesson = await courseService.updateLesson(
        lessonId,
        title,
        description,
        content,
        withExercise,
        exercise
      );
      res.json(Lesson);
    } catch (e) {
      next(e);
    }
  }

  async deleteLesson(
    req: Request<GetLessonType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { lessonId } = req.params;
      await courseService.deleteLesson(lessonId);
      res.json({ message: "Запись об уроке удалена" });
    } catch (e) {
      next(e);
    }
  }

  async getLesson(
    req: Request<GetLessonType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { lessonId } = req.params;
      const Lesson = await courseDataService.getLessonByRoles(
        lessonId,
        req.user
      );
      res.json(Lesson);
    } catch (e) {
      next(e);
    }
  }

  async completeLesson(
    req: Request<GetLessonType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { lessonId } = req.params;
      const Progress = await courseProgressService.completeLessonProgress(
        req.user.id,
        lessonId
      );
      res.json(Progress);
    } catch (e) {
      next(e);
    }
  }

  async createHomework(
    req: Request<GetLessonType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        return next(ApiError.BadRequest("Файл не загружен"));
      }
      const { lessonId } = req.params;
      const userId = req.user.id;
      const { originalname, path } = req.file;
      const Homework = await homeworkService.createHomework(
        lessonId,
        userId,
        originalname,
        path
      );
      res.json(Homework);
    } catch (e) {
      next(e);
    }
  }

  async updateHomework(
    req: Request<GetLessonType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        return next(ApiError.BadRequest("Файл не загружен"));
      }
      const { lessonId } = req.params;
      const userId = req.user.id;
      const { originalname, path } = req.file;
      const Homework = await homeworkService.updateHomework(
        lessonId,
        userId,
        originalname,
        path
      );
      res.json(Homework);
    } catch (e) {
      next(e);
    }
  }
}
export default new LessonsController();
