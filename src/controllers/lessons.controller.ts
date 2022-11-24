import { NextFunction, Request, Response } from "express";

import { unlinkSync } from "fs";
import ApiError from "../exceptions/ApiError";
import courseDataService from "../services/courseAccess.service";
import courseService from "../services/course.service";
import homeworkService from "../services/homework.service";
import courseProgressService from "../services/courseProgress.service";

class LessonsController {
  async createLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { module, title, description, content, withExercise, exercise } =
        req.body;
      if (!module || !title || !description || !content) {
        next(ApiError.BadRequest("Недостаточно данных"));
      }
      const Lesson = await courseService.createLesson(
        module,
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
  async updateLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { lesson } = req.params;
      const { title, description, content, withExercise, exercise } = req.body;
      const Lesson = await courseService.updateLesson(
        lesson,
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
  async deleteLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { lesson } = req.params;
      await courseService.deleteLesson(lesson);
      res.json({ message: "Запись об уроке удалена" });
    } catch (e) {
      next(e);
    }
  }

  async getLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { lesson } = req.params;
      const Lesson = await courseDataService.getLessonByRoles(lesson, req.user);
      res.json(Lesson);
    } catch (e) {
      next(e);
    }
  }

  async completeLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { lesson } = req.params;
      const Progress = await courseProgressService.completeLessonProgress(
        req.user.id,
        lesson
      );
      res.json(Progress);
    } catch (e) {
      next(e);
    }
  }
  async createHomework(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return next(ApiError.BadRequest("Файл не загружен"));
      }
      const { lesson } = req.params;
      const userId = req.user.id;
      const { originalname, path } = req.file;
      const Homework = await homeworkService.createHomework(
        lesson,
        userId,
        originalname,
        path
      );
      res.json(Homework);
    } catch (e) {
      next(e);
    }
  }
  async updateHomework(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return next(ApiError.BadRequest("Файл не загружен"));
      }
      const { lesson } = req.params;
      const userId = req.user.id;
      const { originalname, path } = req.file;
      const Homework = await homeworkService.updateHomework(
        lesson,
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
