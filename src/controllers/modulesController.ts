import { NextFunction, Request, Response } from "express";
import courseConstructionService from "src/services/courseConstructionService";
import coursesService from "src/services/coursesService";

class ModulesController {
  async createModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { course, title, description } = req.body;
      const Module = await courseConstructionService.createModule(
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
      const { id } = req.params;
      const { title, description } = req.body;
      const Module = await courseConstructionService.updateModule(
        id,
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
      const { id } = req.params;
      await courseConstructionService.deleteModule(id);
      res.json({ message: "Модуль успешно удален" });
    } catch (e) {
      next(e);
    }
  }

  async getModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { module } = req.params;
      const Module = await coursesService.getModuleLessonsByRoles(
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
