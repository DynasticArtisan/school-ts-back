import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions/ApiError";
import courseDataService from "../services/courseAccess.service";
import courseService from "../services/course.service";

class ModulesController {
  async createModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { course, title, description } = req.body;
      if (!course || !title || !description) {
        next(ApiError.BadRequest("Недостаточно данных"));
      }
      const Module = await courseService.createModule(
        course,
        title,
        description
      );
      res.json(Module);
    } catch (e) {
      next(e);
    }
  }
  async updateModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { module } = req.params;
      const { title, description } = req.body;
      if (!title || !description) {
        next(ApiError.BadRequest("Недостаточно данных"));
      }
      const Module = await courseService.updateModule(
        module,
        title,
        description
      );
      res.json(Module);
    } catch (e) {
      next(e);
    }
  }
  async deleteModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { module } = req.params;
      await courseService.deleteModule(module);
      res.json({ message: "Модуль успешно удален" });
    } catch (e) {
      next(e);
    }
  }

  async createLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { module } = req.params;
      const { title, description, content, withExercise, exercise } = req.body;
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
  async getLessons(req: Request, res: Response, next: NextFunction) {
    try {
      const { module } = req.params;
      const Module = await courseDataService.getModuleLessonsByRoles(
        module,
        req.user
      );
      res.json(Module);
    } catch (e) {
      next(e);
    }
  }
}
export default new ModulesController();