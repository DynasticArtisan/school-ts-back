import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongoose";
import ApiError from "src/exceptions/ApiError";
import courseConstructionService from "src/services/courseConstructionService";
import coursesService from "src/services/coursesService";
import homeworkService from "src/services/homeworkService";
import { HomeworkStatus } from "src/utils/statuses";

const roles = require("../utils/roles");

const lessonsService = require("../services/lessonsService");
const modulesService = require("../services/modulesService");

const courseMastersService = require("../services/courseMastersService");
const courseProgressService = require("../services/courseProgressService");

class LessonsController {
  async createLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { module, title, description, content, withExercise, exercise } =
        req.body;
      const Lesson = await courseConstructionService.createLesson(
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
      const Lesson = await courseConstructionService.updateLesson(
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
      await courseConstructionService.deleteLesson(id);
      res.json({ message: "Запись об уроке удалена" });
    } catch (e) {
      next(e);
    }
  }
  async getLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { lesson } = req.params;
      const Lesson = await coursesService.getLessonByRoles(lesson, req.user);
      res.json(Lesson);
    } catch (e) {
      next(e);
    }
  }

  async getLessonHomeworks(
    req: Request<{ id: ObjectId }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { role, id: user } = req.user;
      if (role === roles.super) {
        const Lesson = await lessonsService.getLesson(id);
        const Homeworks = await homeworkService.getLessonHomeworks(id);
        res.json({ ...Lesson, homeworks: Homeworks });
      } else if (role === roles.teacher || role === roles.curator) {
        const Lesson = await lessonsService.getLesson(id);
        await courseMastersService.getMaster({ user, course: Lesson.course });
        const Homeworks = await homeworkService.getLessonHomeworks(id);
        res.json({ ...Lesson, homeworks: Homeworks });
      } else {
        next(ApiError.Forbidden());
      }
    } catch (e) {
      next(e);
    }
  }

  async createHomework(
    req: Request<{ id: ObjectId }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        throw ApiError.BadRequest("Ошибка в записи файла");
      }
      const { id: lesson } = req.params;
      const { role, id: user } = req.user;
      const { filename, filepath } = req.file;
      if (role === roles.user) {
        const { course } = await courseProgressService.getLessonProgress({
          lesson,
          user,
        });
        const Homework = await homeworkService.createHomework(
          user,
          lesson,
          course
        );
        const File = await homeworkService.createFile(
          Homework._id,
          user,
          filename,
          filepath
        );
        res.json({ ...Homework, files: [File] });
      } else {
        next(ApiError.Forbidden());
      }
    } catch (e) {
      next(e);
    }
  }

  async updateHomework(
    req: Request<{ id: ObjectId }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        throw ApiError.BadRequest("Ошибка в записи файла");
      }
      const { id } = req.params;
      const { role, id: user } = req.user;
      const { filename, filepath } = req.file;
      if (role === roles.user) {
        const Homework = await homeworkService.updateHomework(
          id,
          HomeworkStatus.wait
        );
        const File = await homeworkService.createFile(
          id,
          user,
          filename,
          filepath
        );
        res.json(File);
      } else {
        next(ApiError.Forbidden());
      }
    } catch (e) {
      next(e);
    }
  }

  async completeLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: lesson } = req.params;
      const { role, id: user } = req.user;
      if (role === roles.user) {
        const Progress = await courseProgressService.completeLessonProgress({
          lesson,
          user,
        });
        res.json(Progress);
      } else {
        next(ApiError.Forbidden());
      }
    } catch (error) {}
  }
}
export default new LessonsController();
