import { NextFunction, Request, Response } from "express";

import { unlinkSync } from "fs";
import ApiError from "../exceptions/ApiError";
import courseDataService from "../services/courseData.service";
import courseService from "../services/course.service";
import homeworkService from "../services/homework.service";

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
      const { id } = req.params;
      const { title, description, content, withExercise, exercise } = req.body;
      const Lesson = await courseService.updateLesson(
        id,
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
      const { id } = req.params;
      await courseService.deleteLesson(id);
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

  async createHomework(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return next(ApiError.BadRequest("Ошибка в записи файла"));
      }
      const { lesson } = req.params;
      const Homework = await homeworkService.createHomework(
        lesson,
        req.user.id,
        req.file.filename,
        req.file.path
      );
      res.json(Homework);
    } catch (e) {
      if (req.file) {
        unlinkSync(req.file.path);
      }
      next(e);
    }
  }
  async updateHomework(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return next(ApiError.BadRequest("Ошибка в записи файла"));
      }
      const { lesson } = req.params;
      const Homework = await homeworkService.updateHomework(
        lesson,
        req.user.id,
        req.file.filename,
        req.file.path
      );
      res.json(Homework);
    } catch (e) {
      if (req.file) {
        unlinkSync(req.file.path);
      }
      next(e);
    }
  }
}
export default new LessonsController();
