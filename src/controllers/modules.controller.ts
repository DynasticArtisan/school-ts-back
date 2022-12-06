import { NextFunction, Request, Response } from "express";
import {
  CreateLessonType,
  CreateModuleType,
  GetModuleType,
  UpdateModuleType,
} from "../schemas/module.schema";
import courseService from "../services/course.service";
import courseDataService from "../services/courseAccess.service";
import ApiError from "../exceptions/ApiError";

class ModulesController {
  async createModule(
    req: Request<{}, {}, CreateModuleType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId, title, description } = req.body;
      const Module = await courseService.createModule(
        courseId,
        title,
        description
      );
      res.json(Module);
    } catch (e) {
      next(e);
    }
  }

  async updateModule(
    req: Request<UpdateModuleType["params"], {}, UpdateModuleType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { moduleId } = req.params;
      const { title, description } = req.body;
      const Module = await courseService.updateModule(
        moduleId,
        title,
        description
      );
      res.json(Module);
    } catch (e) {
      next(e);
    }
  }

  async getLessons(
    req: Request<GetModuleType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { moduleId } = req.params;
      const Module = await courseDataService.getModuleLessonsByRoles(
        moduleId,
        req.user
      );
      res.json(Module);
    } catch (e) {
      next(e);
    }
  }

  async deleteModule(
    req: Request<GetModuleType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { moduleId } = req.params;
      await courseService.deleteModule(moduleId);
      res.json({ message: "Модуль успешно удален" });
    } catch (e) {
      next(e);
    }
  }

  async createLesson(
    req: Request<CreateLessonType["params"], {}, CreateLessonType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { moduleId } = req.params;
      const { title, description, content, withExercise, exercise } = req.body;
      if (!module || !title || !description || !content) {
        next(ApiError.BadRequest("Недостаточно данных"));
      }
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
}
export default new ModulesController();
